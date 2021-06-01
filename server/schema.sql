CREATE DATABASE keycloak;
USE keycloak;

/* AUTO GENERATED CODE */
CREATE TABLE USER_ENTITY
(
    id         char(36) PRIMARY KEY,
    first_name varchar(255),
    last_name  varchar(255),
    username   varchar(255),
    password   varchar(255),
    email      varchar(255)
);

CREATE TABLE servers
(
    id             int PRIMARY KEY AUTO_INCREMENT,
    name           varchar(255) NOT NULL,
    user_id        char(36)     NOT NULL REFERENCES USER_ENTITY (id) COMMENT 'owner',
    invitation     char(36),
    invitation_exp datetime,
    CHECK (
            (invitation IS NULL AND invitation_exp IS NULL) OR
            (invitation IS NOT NULL AND invitation_exp IS NOT NULL)
        )
);

CREATE TABLE `groups`
(
    id        int PRIMARY KEY AUTO_INCREMENT,
    server_id int          NOT NULL REFERENCES servers (id),
    name      varchar(255) NOT NULL,
    `order`   int          NOT NULL DEFAULT 0 COMMENT 'group order'
);

CREATE TABLE channels
(
    id        int PRIMARY KEY AUTO_INCREMENT,
    server_id int                    NOT NULL REFERENCES servers (id),
    group_id  int REFERENCES `groups` (id),
    type      ENUM ('text', 'voice') NOT NULL,
    name      varchar(255)           NOT NULL,
    `order`   int                    NOT NULL DEFAULT 0 COMMENT 'channel order'
);

CREATE TABLE members
(
    id        int PRIMARY KEY AUTO_INCREMENT,
    server_id int      NOT NULL REFERENCES servers (id),
    user_id   char(36) NOT NULL REFERENCES USER_ENTITY (id),
    `order`   int      NOT NULL DEFAULT 0 COMMENT 'user server order preference'
);

CREATE TABLE messages
(
    id         int PRIMARY KEY AUTO_INCREMENT,
    channel_id int          NOT NULL REFERENCES channels (id),
    user_id    char(36)     NOT NULL REFERENCES USER_ENTITY (id),
    timestamp  datetime     NOT NULL DEFAULT NOW(),
    text       varchar(255) NOT NULL
);

/* END OF AUTO GENERATED CODE */

CREATE UNIQUE INDEX unique_member
    ON members (server_id, user_id);

CREATE TRIGGER before_insert_server
    BEFORE INSERT
    ON servers
    FOR EACH ROW
BEGIN
    IF (LENGTH(TRIM(NEW.name)) = 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Server name must not be empty';
    END IF;
END;

CREATE TRIGGER after_insert_server
    AFTER INSERT
    ON servers
    FOR EACH ROW
BEGIN
    INSERT INTO `groups` (server_id, name) VALUES (NEW.id, 'Text channels');
    SET @g1_id = LAST_INSERT_ID();
    INSERT INTO `groups` (server_id, name, `order`) VALUES (NEW.id, 'Voice channels', 1);
    SET @g2_id = LAST_INSERT_ID();
    INSERT INTO channels (server_id, group_id, type, name) VALUES (NEW.id, @g1_id, 'text', 'general');
    INSERT INTO channels (server_id, group_id, type, name) VALUES (NEW.id, @g2_id, 'voice', 'General');
    INSERT INTO members (server_id, user_id) VALUES (NEW.id, NEW.user_id);
END;

CREATE TRIGGER delete_server
    BEFORE DELETE
    ON servers
    FOR EACH ROW
BEGIN
    DELETE FROM members WHERE server_id = OLD.id;
    DELETE messages
    FROM messages,
         channels
    WHERE channels.server_id = OLD.id
      AND channels.type = 'text'
      AND messages.channel_id = channels.id;
    DELETE FROM channels WHERE channels.server_id = OLD.id;
    DELETE FROM `groups` WHERE `groups`.server_id = OLD.id;
END;

CREATE TRIGGER insert_group
    BEFORE INSERT
    ON `groups`
    FOR EACH ROW
BEGIN
    IF (LENGTH(TRIM(NEW.name)) = 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Group name must not be empty';
    END IF;
END;

CREATE TRIGGER insert_channel
    BEFORE INSERT
    ON channels
    FOR EACH ROW
BEGIN
    IF (LENGTH(TRIM(NEW.name)) = 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Channel name must not be empty';
    END IF;
END;

CREATE TRIGGER insert_message
    BEFORE INSERT
    ON messages
    FOR EACH ROW
BEGIN
    SELECT type INTO @TYPE FROM channels WHERE NEW.channel_id = id;
    IF (@TYPE IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Channel doesn\'t exist';
    ELSEIF (@TYPE = 'voice') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Voice channels can\'t contain text messages';
    ELSEIF (LENGTH(TRIM(NEW.text)) = 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Message text must not be empty';
    END IF;
END;

CREATE VIEW get_server_data AS
SELECT s.id       AS server_id,
       s.name     AS server_name,
       s.user_id  AS owner,
       g.id       AS group_id,
       g.name     AS group_name,
       g.order    AS group_order,
       c.id       AS channel_id,
       c.name     AS channel_name,
       c.group_id AS channel_gid,
       c.type     AS channel_type,
       c.order    AS channel_order,
       m.id       AS member_id,
       m.user_id  AS member_uid,
       m.order    AS server_order
FROM servers s
         LEFT JOIN channels c ON s.id = c.server_id
         LEFT JOIN `groups` g ON s.id = g.server_id
         LEFT JOIN members m ON s.id = m.server_id;

CREATE PROCEDURE get_server_data(sid int, uid char(36))
BEGIN
    SET @id = NULL;
    SELECT id INTO @id FROM members WHERE server_id = sid AND user_id = uid;
    IF (@id IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    SELECT * FROM get_server_data WHERE server_id = sid;
END;

CREATE FUNCTION create_invitation(sid int, uid char(36)) RETURNS char(36)
BEGIN
    SELECT s.invitation, s.invitation_exp, m.user_id
    INTO @INVITATION, @INVITATION_EXP, @mid
    FROM servers s
             LEFT JOIN members m ON s.id = m.server_id AND uid = m.user_id
    WHERE sid = s.id;
    IF (@mid IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    IF (@INVITATION IS NOT NULL AND @INVITATION_EXP > NOW()) THEN
        RETURN @INVITATION;
    END IF;
    SET @INVITATION = UUID();
    UPDATE servers s SET invitation = @INVITATION, invitation_exp = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE sid = s.id;
    RETURN @INVITATION;
END;

CREATE PROCEDURE join_server(invitation char(36), uid char(36))
BEGIN
    SELECT s.id, s.invitation, s.invitation_exp, m.user_id
    INTO @SID, @INVITATION, @INVITATION_EXP, @mid
    FROM servers s
             LEFT JOIN members m ON s.id = m.server_id AND uid = m.user_id
    WHERE invitation = s.invitation;
    IF (@INVITATION IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Bad invitation';
    END IF;
    IF (@mid IS NOT NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User already a member of this server';
    END IF;
    IF (@INVITATION_EXP < NOW()) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invitation expired';
    END IF;
    SELECT * FROM get_server_data WHERE server_id = @SID;
END;

CREATE FUNCTION send_message(cid int, uid char(36), txt varchar(255)) RETURNS int
BEGIN
    SELECT m.id
    INTO @ID
    FROM members m
             JOIN servers s on m.server_id = s.id
    WHERE m.user_id = uid;
    IF (@ID IS NOT NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    INSERT INTO messages (channel_id, user_id, text) VALUES (cid, uid, txt);

    RETURN LAST_INSERT_ID();

END;

CREATE FUNCTION create_channel(sid int, gid int, typ ENUM ('text', 'voice'), nam varchar(255), uid char(36)) RETURNS int
BEGIN
    SELECT id INTO @ID from members m WHERE uid = m.user_id AND sid = m.server_id;
    IF (@ID IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    INSERT INTO channels (server_id, group_id, type, name) VALUES (sid, gid, typ, nam);
    RETURN LAST_INSERT_ID();
END;

CREATE FUNCTION create_group(sid int, nam varchar(255), uid char(36)) RETURNS int
BEGIN
    SELECT id INTO @ID from members m WHERE uid = m.user_id AND sid = m.server_id;
    IF (@ID IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    INSERT INTO `groups` (server_id, name) VALUES (sid, nam);
    RETURN LAST_INSERT_ID();
END;

CREATE PROCEDURE get_messages(cid int, uid char(36), offset int)
BEGIN
    SET @ID = NULL;

    SELECT m.id
    INTO @ID
    FROM members m
             JOIN servers s ON m.server_id = s.id
             JOIN channels c ON cid = c.id
    WHERE m.user_id = uid;
    IF (@ID IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    SELECT m.id         AS message_id,
           m.user_id    AS user_id,
           m.timestamp  AS timestamp,
           m.channel_id AS channel_id,
           m.text       AS message
    FROM messages m
             LEFT JOIN channels c ON m.channel_id = c.id
    WHERE c.id = cid
    ORDER BY timestamp DESC, message_id DESC
    LIMIT 30 OFFSET offset;
END;

INSERT INTO USER_ENTITY (id, first_name, last_name, username, password, email)
VALUES ('a88b1b9c-3a9b-4f05-87e8-93da126a4d94', 'First', 'Name', 'user1', 'passwd', 'email@email.com');

INSERT INTO servers (name, user_id)
VALUES ('server1', 'a88b1b9c-3a9b-4f05-87e8-93da126a4d94');

INSERT INTO messages (channel_id, user_id, text)
VALUES (1, 'a88b1b9c-3a9b-4f05-87e8-93da126a4d94', 'un mesaj de la user1');

INSERT INTO channels (server_id, group_id, type, name)
VALUES (1, null, 'text', 'nume-canal');

INSERT INTO messages (channel_id, user_id, text)
VALUES (3, 'a88b1b9c-3a9b-4f05-87e8-93da126a4d94', 'un alt mesaj de la user1');

CALL get_server_data(1, 'a88b1b9c-3a9b-4f05-87e8-93da126a4d94');

CALL get_messages(3, 'a88b1b9c-3a9b-4f05-87e8-93da126a4d94', 0);
