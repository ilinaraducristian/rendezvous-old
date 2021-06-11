DROP DATABASE IF EXISTS capp;
CREATE DATABASE capp;
USE capp;

DELIMITER $$

/* AUTO GENERATED CODE */

CREATE TABLE servers
(
    id             int PRIMARY KEY AUTO_INCREMENT,
    name           varchar(255) NOT NULL,
    user_id        char(36)     NOT NULL COMMENT 'owner',
    invitation     char(36),
    invitation_exp datetime,
    FOREIGN KEY (user_id) REFERENCES keycloak.USER_ENTITY (id),
    CHECK (
            (invitation IS NULL AND invitation_exp IS NULL) OR
            (invitation IS NOT NULL AND invitation_exp IS NOT NULL)
        )
)$$

CREATE TABLE `groups`
(
    id        int PRIMARY KEY AUTO_INCREMENT,
    server_id int          NOT NULL,
    name      varchar(255) NOT NULL,
    `order`   int          NOT NULL DEFAULT 0 COMMENT 'group order',
    FOREIGN KEY (server_id) REFERENCES servers (id)
)$$

CREATE TABLE channels
(
    id        int PRIMARY KEY AUTO_INCREMENT,
    server_id int                    NOT NULL,
    group_id  int,
    type      ENUM ('text', 'voice') NOT NULL,
    name      varchar(255)           NOT NULL,
    `order`   int                    NOT NULL DEFAULT 0 COMMENT 'channel order',
    FOREIGN KEY (server_id) REFERENCES servers (id),
    FOREIGN KEY (group_id) REFERENCES `groups` (id)
)$$

CREATE TABLE members
(
    id        int PRIMARY KEY AUTO_INCREMENT,
    server_id int      NOT NULL,
    user_id   char(36) NOT NULL,
    `order`   int      NOT NULL DEFAULT 0 COMMENT 'user server order preference',
    FOREIGN KEY (server_id) REFERENCES servers (id),
    FOREIGN KEY (user_id) REFERENCES keycloak.USER_ENTITY (id)
)$$

CREATE TABLE messages
(
    id         int PRIMARY KEY AUTO_INCREMENT,
    channel_id int          NOT NULL,
    user_id    char(36)     NOT NULL,
    timestamp  datetime     NOT NULL DEFAULT NOW(),
    text       varchar(255) NOT NULL,
    FOREIGN KEY (channel_id) REFERENCES channels (id),
    FOREIGN KEY (user_id) REFERENCES keycloak.USER_ENTITY (id)
)$$

/* END OF AUTO GENERATED CODE */

CREATE UNIQUE INDEX unique_member
    ON members (server_id, user_id)$$

CREATE TRIGGER trigger_before_delete_on_servers
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
END $$

CREATE TRIGGER trigger_before_insert_on_groups
    BEFORE INSERT
    ON `groups`
    FOR EACH ROW
BEGIN
    IF (LENGTH(TRIM(NEW.name)) = 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Group name must not be empty';
    END IF;
END $$

CREATE TRIGGER trigger_before_insert_on_channels
    BEFORE INSERT
    ON channels
    FOR EACH ROW
BEGIN
    IF (LENGTH(TRIM(NEW.name)) = 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Channel name must not be empty';
    END IF;
END $$

CREATE TRIGGER trigger_before_insert_on_messages
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
END $$

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

CREATE PROCEDURE get_user_servers(uid char(36))
BEGIN
    SELECT *
    FROM servers
             JOIN members ON servers.id = members.server_id AND members.user_id = uid;
END $$

CREATE PROCEDURE get_user_servers_data(uid char(36))
BEGIN
    SELECT * FROM get_server_data WHERE member_uid = uid;
END $$

CREATE PROCEDURE get_user_server_data(uid char(36), sid int)
BEGIN
    SET @MEMBER_ID = NULL;
    SELECT id INTO @MEMBER_ID FROM members WHERE server_id = sid AND user_id = uid;
    IF (@MEMBER_ID IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    SELECT * FROM get_server_data WHERE server_id = sid;
END $$

CREATE FUNCTION create_invitation(uid char(36), sid int) RETURNS char(36)
    MODIFIES SQL DATA DETERMINISTIC
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
    UPDATE servers s
    SET invitation     = @INVITATION,
        invitation_exp = DATE_ADD(NOW(), INTERVAL 7 DAY)
    WHERE sid = s.id;
    RETURN @INVITATION;
END $$

CREATE PROCEDURE join_server(uid char(36), invitation char(36))
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
    INSERT INTO members (server_id, user_id) VALUES (@SID, uid);
    SELECT * FROM get_server_data WHERE server_id = @SID;
END $$

CREATE PROCEDURE send_message(uid char(36), cid int, txt varchar(255))
BEGIN
    SELECT m.id, s.id
    INTO @MEMBER_ID, @SERVER_ID
    FROM members m
             JOIN servers s on m.server_id = s.id
    WHERE m.user_id = uid;
    IF (@MEMBER_ID IS NOT NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    INSERT INTO messages (channel_id, user_id, text) VALUES (cid, uid, txt);

    SELECT m.id AS message_id, @SERVER_ID AS server_id, timestamp
    FROM messages m
    WHERE LAST_INSERT_ID() = m.id;

END $$

CREATE PROCEDURE create_server(uid char(36), server_name varchar(255))
BEGIN
    IF (LENGTH(TRIM(server_name)) = 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Server name must not be empty';
    END IF;
    INSERT INTO servers (name, user_id) VALUES (server_name, uid);
    SET @SID = LAST_INSERT_ID();
    INSERT INTO `groups` (server_id, name) VALUES (@SID, 'Text channels');
    SET @G1ID = LAST_INSERT_ID();
    INSERT INTO `groups` (server_id, name, `order`) VALUES (@SID, 'Voice channels', 1);
    SET @G2ID = LAST_INSERT_ID();
    INSERT INTO channels (server_id, group_id, type, name) VALUES (@SID, @G1ID, 'text', 'general');
    SET @C1ID = LAST_INSERT_ID();
    INSERT INTO channels (server_id, group_id, type, name) VALUES (@SID, @G2ID, 'voice', 'General');
    SET @C2ID = LAST_INSERT_ID();
    INSERT INTO members (server_id, user_id) VALUES (@SID, uid);
    SET @MID = LAST_INSERT_ID();
    SELECT @SID  as server_id,
           @G1ID as group1_id,
           @G2ID as group2_id,
           @C1ID as channel1_id,
           @C2ID as channel2_id,
           @MID  as member_id;
END $$

CREATE FUNCTION create_group(uid char(36), sid int, nam varchar(255)) RETURNS int DETERMINISTIC
    MODIFIES SQL DATA
BEGIN
    SELECT id
    INTO @MEMBER_ID
    from members m
    WHERE uid = m.user_id
      AND sid = m.server_id;
    IF (@MEMBER_ID IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    INSERT INTO `groups` (server_id, name) VALUES (sid, nam);
    RETURN LAST_INSERT_ID();
END $$

CREATE FUNCTION create_channel(uid char(36), sid int, gid int,
                               typ ENUM ('text', 'voice'),
                               nam varchar(255))
    RETURNS int DETERMINISTIC
    MODIFIES SQL DATA
BEGIN
    SELECT id
    INTO @MEMBER_ID
    from members m
    WHERE uid = m.user_id
      AND sid = m.server_id;
    IF (@MEMBER_ID IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    INSERT INTO channels (server_id, group_id, type, name)
    VALUES (sid, gid, typ, nam);
    RETURN LAST_INSERT_ID();
END $$

CREATE PROCEDURE get_messages(uid char(36), cid int, offset int)
BEGIN
    SET @MEMBER_ID = NULL;

    SELECT m.id
    INTO @MEMBER_ID
    FROM members m
             JOIN servers s ON m.server_id = s.id
             JOIN channels c ON cid = c.id
    WHERE m.user_id = uid;
    IF (@MEMBER_ID IS NULL) THEN
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
END $$