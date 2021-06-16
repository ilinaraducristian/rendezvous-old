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
    server_id  int          NOT NULL,
    channel_id int          NOT NULL,
    user_id    char(36)     NOT NULL,
    timestamp  datetime     NOT NULL DEFAULT NOW(),
    text       varchar(255) NOT NULL,
    FOREIGN KEY (server_id) REFERENCES servers (id),
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

CREATE VIEW get_users AS
SELECT u.id AS id, u.USERNAME AS username, u.FIRST_NAME as first_name, u.LAST_NAME AS last_name
FROM keycloak.USER_ENTITY u;

CREATE PROCEDURE get_user_servers_data(userId char(36))
BEGIN
    SELECT s.id, s.name, s.user_id as owner, s.invitation, s.invitation_exp, m.order
    FROM servers s
             JOIN members m ON s.id = m.server_id
        AND m.user_id = userId;
    SELECT g.id, g.server_id, g.name, g.`order`
    FROM `groups` g
             JOIN members m ON g.server_id = m.server_id
        AND m.user_id = userId;
    SELECT c.id, c.server_id, c.group_id, c.type, c.name, c.`order`
    FROM channels c
             JOIN members m ON c.server_id = m.server_id
        AND m.user_id = userId;
    SELECT m1.id, m1.server_id, m1.user_id, m1.`order`
    FROM members m1
             JOIN members m2 ON m1.server_id = m2.server_id
    WHERE m2.user_id = userId;
END $$

CREATE PROCEDURE get_users_data(serverId int)
BEGIN
    SELECT keycloak.USER_ENTITY.ID         as id,
           keycloak.USER_ENTITY.EMAIL      as email,
           keycloak.USER_ENTITY.FIRST_NAME as first_name,
           keycloak.USER_ENTITY.LAST_NAME  as last_name,
           keycloak.USER_ENTITY.USERNAME   as username
    FROM keycloak.USER_ENTITY
             JOIN capp.members ON USER_ENTITY.ID = members.user_id
    WHERE members.server_id = serverId;
END $$

CREATE FUNCTION create_invitation(userId char(36), serverId int) RETURNS char(36)
    MODIFIES SQL DATA DETERMINISTIC
BEGIN
    SELECT s.invitation, s.invitation_exp, m.user_id
    INTO @INVITATION, @INVITATION_EXP, @mid
    FROM servers s
             LEFT JOIN members m ON s.id = m.server_id AND userId = m.user_id
    WHERE serverId = s.id;
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
    WHERE serverId = s.id;
    RETURN @INVITATION;
END $$

CREATE PROCEDURE join_server(userId char(36), invitation char(36))
BEGIN
    SELECT s.id, s.invitation, s.invitation_exp, m.user_id
    INTO @SID, @INVITATION, @INVITATION_EXP, @mid
    FROM servers s
             LEFT JOIN members m ON s.id = m.server_id AND userId = m.user_id
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
    INSERT INTO members (server_id, user_id) VALUES (@SID, userId);
END $$

CREATE FUNCTION send_message(userId char(36), serverId int, channelId int, messageText varchar(255)) RETURNS int
    MODIFIES SQL DATA DETERMINISTIC
BEGIN
    SELECT m.id
    INTO @MEMBER_ID
    FROM members m
    WHERE m.user_id = userId
      AND m.server_id = serverId;
    IF (@MEMBER_ID IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    INSERT INTO messages (server_id, channel_id, user_id, text) VALUES (serverId, channelId, userId, messageText);

    RETURN LAST_INSERT_ID();

END $$

CREATE PROCEDURE create_server(userId char(36), serverName varchar(255), serverOrder int)
BEGIN
    IF (LENGTH(TRIM(serverName)) = 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Server name must not be empty';
    END IF;
    INSERT INTO servers (name, user_id) VALUES (serverName, userId);
    SET @SID = LAST_INSERT_ID();
    INSERT INTO `groups` (server_id, name, `order`) VALUES (@SID, 'Text channels', 0);
    SET @G1ID = LAST_INSERT_ID();
    INSERT INTO `groups` (server_id, name, `order`) VALUES (@SID, 'Voice channels', 1);
    SET @G2ID = LAST_INSERT_ID();
    INSERT INTO channels (server_id, group_id, type, name) VALUES (@SID, @G1ID, 'text', 'general');
    SET @C1ID = LAST_INSERT_ID();
    INSERT INTO channels (server_id, group_id, type, name) VALUES (@SID, @G2ID, 'voice', 'General');
    SET @C2ID = LAST_INSERT_ID();
    IF serverOrder IS NULL THEN
        INSERT INTO members (server_id, user_id) VALUES (@SID, userId);
    ELSE
        INSERT INTO members (server_id, user_id, `order`) VALUES (@SID, userId, serverOrder);
    END IF;
    SET @MID = LAST_INSERT_ID();
    SELECT @SID  as server_id,
           @G1ID as group1_id,
           @G2ID as group2_id,
           @C1ID as channel1_id,
           @C2ID as channel2_id,
           @MID  as member_id;
END $$

CREATE FUNCTION create_group(userId char(36), serverId int, groupName varchar(255),
                             groupOrder int) RETURNS int DETERMINISTIC
    MODIFIES SQL DATA
BEGIN
    SELECT id
    INTO @MEMBER_ID
    from members m
    WHERE userId = m.user_id
      AND serverId = m.server_id;
    IF (@MEMBER_ID IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    INSERT INTO `groups` (server_id, name, `order`) VALUES (serverId, groupName, groupOrder);
    RETURN LAST_INSERT_ID();
END $$

CREATE FUNCTION create_channel(userId char(36), serverId int, groupId int,
                               channelType ENUM ('text', 'voice'),
                               channelName varchar(255), channelOrder int)
    RETURNS int DETERMINISTIC
    MODIFIES SQL DATA
BEGIN
    SELECT id
    INTO @MEMBER_ID
    from members m
    WHERE userId = m.user_id
      AND serverId = m.server_id;
    IF (@MEMBER_ID IS NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User is not a member of this server';
    END IF;
    INSERT INTO channels (server_id, group_id, type, name, `order`)
    VALUES (serverId, groupId, channelType, channelName, channelOrder);
    RETURN LAST_INSERT_ID();
END $$

CREATE PROCEDURE get_messages(userId char(36), channelId int, offset int)
BEGIN
    SET @MEMBER_ID = NULL;

    SELECT m.id
    INTO @MEMBER_ID
    FROM members m
             JOIN servers s ON m.server_id = s.id
             JOIN channels c ON channelId = c.id
    WHERE m.user_id = userId;
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
    WHERE c.id = channelId
    ORDER BY timestamp DESC, message_id DESC
    LIMIT 30 OFFSET offset;
END $$

# CALL create_server('509652db-483c-4328-85b1-120573723b3a', 'a new server', 0);
#
# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, NULL, 'text', 'channel without group', 0);
# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, 1, 'text', 'text channel in the first group', 1);
# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, 2, 'voice', 'voice channel in the second group', 1);
#
# SELECT create_group('509652db-483c-4328-85b1-120573723b3a', 1, 'a new group', 2);
# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, 3, 'text', 'text channel in the third group', 0);
# SELECT create_channel('509652db-483c-4328-85b1-120573723b3a', 1, 3, 'voice', 'voice channel in the third group', 1);
#
# # SELECT create_invitation('509652db-483c-4328-85b1-120573723b3a', 1);
# CALL join_server('8161216d-c1c8-4d01-b21a-ba1f559d29e9', (
#     SELECT create_invitation('509652db-483c-4328-85b1-120573723b3a', 1)
# ));
#
# CALL get_user_servers_data('509652db-483c-4328-85b1-120573723b3a');
# CALL get_user_servers_data('8161216d-c1c8-4d01-b21a-ba1f559d29e9');