CREATE DATABASE capp;
USE capp;
CREATE TABLE `USER_ENTITY` (
  `id` char(36) PRIMARY KEY,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `username` varchar(255),
  `password` varchar(255),
  `email` varchar(255)
);

CREATE TABLE `servers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` char(36) NOT NULL COMMENT 'owner',
  `name` varchar(255) NOT NULL,
  `avatar` char(36) COMMENT 'stored in CDN',
  `invitation_code` varchar(255),
  `invitation_exp` datetime
);

CREATE TABLE `groups` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order` tinyint unsigned,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `channels` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `type` ENUM ('text', 'voice') NOT NULL,
  `order` tinyint unsigned,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
);

CREATE TABLE `members` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `server_id` int NOT NULL
);

CREATE TABLE `messages` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `channel_id` int NOT NULL,
  `text` varchar(255) NOT NULL
);

CREATE TABLE `roles` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `server_id` int NOT NULL,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `member_roles` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `role_id` int
);

CREATE TABLE `server_permissions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `administrator` boolean NOT NULL DEFAULT false,
  `can_rename_server` boolean NOT NULL DEFAULT false,
  `can_create_roles` boolean NOT NULL DEFAULT false,
  `can_rename_roles` boolean NOT NULL DEFAULT false,
  `can_delete_roles` boolean NOT NULL DEFAULT false,
  `can_kick_members` boolean NOT NULL DEFAULT false,
  `can_ban_members` boolean NOT NULL DEFAULT false,
  `can_write_text` boolean NOT NULL,
  `can_read_text` boolean NOT NULL,
  `can_create_tc` boolean NOT NULL DEFAULT false,
  `can_rename_tc` boolean NOT NULL DEFAULT false,
  `can_delete_tc` boolean NOT NULL DEFAULT false,
  `can_speak` boolean NOT NULL,
  `can_listen` boolean NOT NULL,
  `can_create_vc` boolean NOT NULL DEFAULT false,
  `can_rename_vc` boolean NOT NULL DEFAULT false,
  `can_delete_vc` boolean NOT NULL DEFAULT false
);

CREATE TABLE `group_permissions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `group_id` int,
  `role_id` int NOT NULL,
  `can_write_text` boolean,
  `can_read_text` boolean,
  `can_create_tc` boolean,
  `can_rename_tc` boolean,
  `can_delete_tc` boolean,
  `can_speak` boolean,
  `can_listen` boolean,
  `can_create_vc` boolean,
  `can_rename_vc` boolean,
  `can_delete_vc` boolean
);

CREATE TABLE `tc_permissions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `channel_id` int,
  `role_id` int NOT NULL,
  `can_write` boolean,
  `can_read` boolean,
  `can_rename` boolean,
  `can_delete` boolean
);

CREATE TABLE `vc_permissions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `channel_id` int,
  `role_id` int NOT NULL,
  `can_speak` boolean,
  `can_listen` boolean,
  `can_rename` boolean,
  `can_delete` boolean
);

ALTER TABLE `servers` ADD FOREIGN KEY (`user_id`) REFERENCES `USER_ENTITY` (`id`);

ALTER TABLE `channels` ADD FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`);

ALTER TABLE `members` ADD FOREIGN KEY (`user_id`) REFERENCES `USER_ENTITY` (`id`);

ALTER TABLE `members` ADD FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`user_id`) REFERENCES `USER_ENTITY` (`id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`);

ALTER TABLE `roles` ADD FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`);

ALTER TABLE `member_roles` ADD FOREIGN KEY (`member_id`) REFERENCES `members` (`id`);

ALTER TABLE `member_roles` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `server_permissions` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `group_permissions` ADD FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`);

ALTER TABLE `group_permissions` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `tc_permissions` ADD FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`);

ALTER TABLE `tc_permissions` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `vc_permissions` ADD FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`);

ALTER TABLE `vc_permissions` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

# CREATE TRIGGER ins_server
#     AFTER INSERT
#     ON servers
#     FOR EACH ROW
# BEGIN
#     INSERT INTO roles (server_id, name, description) VALUES (NEW.id, 'everyone', 'Default role assigned to every member');
#     INSERT INTO server_permissions (`server_id`, `role_id`) VALUES (NEW.id, LAST_INSERT_ID());
# END;
#
# CREATE TRIGGER ins_member
#     AFTER INSERT
#     ON members
#     FOR EACH ROW
# BEGIN
#     INSERT INTO user_roles (user_id, role_id) VALUES (NEW.id, (SELECT id FROM roles WHERE roles.server_id = NEW.server_id AND roles.name = 'everyone'));
# END;

CREATE PROCEDURE create_server(IN server_name varchar(255), IN owner char(36))
BEGIN
    # create the server
    INSERT INTO servers (name, user_id) VALUES (server_name, owner);
    SET @new_server_id = LAST_INSERT_ID();
    # create text channels group
    INSERT INTO `groups` (`order`, name) VALUES (0, 'Text channels');
    SET @tg_id = LAST_INSERT_ID();
    # create voice channels group
    INSERT INTO `groups` (`order`, name) VALUES (1, 'Voice channels');
    SET @vg_id = LAST_INSERT_ID();
    # create text channel
    INSERT INTO channels (group_id, type, `order`, name, description) VALUES (@tg_id, 'text', 0, 'general', '');
    SET @tc_id = LAST_INSERT_ID();
    # create voice channel
    INSERT INTO channels (group_id, type, `order`, name, description) VALUES (@vg_id, 'voice', 0, 'General', '');
    SET @vc_id = LAST_INSERT_ID();
    # create everyone role
    INSERT INTO roles (server_id, name) VALUES (@new_server_id, 'everyone');
    SET @role_id = LAST_INSERT_ID();

    # assign role to groups
    INSERT INTO group_permissions (group_id, role_id) VALUES (@tg_id, @role_id);
    INSERT INTO group_permissions (group_id, role_id) VALUES (@vg_id, @role_id);

    # assign role to channels
    # tc
    INSERT INTO tc_permissions (channel_id, role_id) VALUES (@tc_id, @role_id);
    # vc
    INSERT INTO vc_permissions (channel_id, role_id) VALUES (@vc_id, @role_id);

    # insert the owner into members
    INSERT INTO members (user_id, server_id) VALUES (owner, @new_server_id);
    SET @member_id = LAST_INSERT_ID();

    # assign role everyone to owner
    INSERT INTO member_roles (member_id, role_id) VALUES (@member_id, @role_id);

END;

CREATE PROCEDURE create_invitation(IN server_id int, OUT code char(36))
BEGIN
    SET @code = (SELECT invitation_code FROM servers WHERE id = server_id AND invitation_exp < CURRENT_TIMESTAMP());

    # generate UUID
    SET code = UUID();
    # create the server
    UPDATE servers SET invitation_exp = CURRENT_TIMESTAMP(), invitation_code = code WHERE id = server_id;
END;

# CREATE TRIGGER ins_server
#     AFTER INSERT
#     ON servers
#     FOR EACH ROW
# BEGIN
#     INSERT INTO roles (server_id, name, description, can_read_text, can_write_text, can_listen, can_speak) VALUES (NEW.id, 'everyone', 'Default role assigned to every member');
#     INSERT INTO server_permissions (server_id, role_id) VALUES (NEW.id, (SELECT LAST_INSERT_ID()));
# END;
# CREATE TRIGGER ins_member
#     AFTER INSERT
#     ON members
#     FOR EACH ROW
# BEGIN
#     INSERT INTO user_roles (user_id, role_id) VALUES (NEW.id, (SELECT id FROM roles WHERE roles.server_id = NEW.server_id AND roles.name = 'everyone'));
# END;
# CREATE TRIGGER ins_channel
#     AFTER INSERT
#     ON channels
#     FOR EACH ROW
# BEGIN
#     INSERT INTO channel_permissions (channel_id, role_id) VALUES (NEW.id, (SELECT id FROM roles WHERE roles.server_id = NEW.server_id AND roles.name = 'everyone'));
# END;
# CREATE TRIGGER ins_message
#     BEFORE INSERT
#     ON messages
#     FOR EACH ROW
# BEGIN
#
#     SELECT 1 FROM channel_permissions cp
#         JOIN user_roles ur ON ur.user_id = NEW.user_id
#     JOIN roles r ON r.id = ur.role_id
#     WHERE r.id = cp.role_id AND cp.can_write_messages = FALSE
# END;



