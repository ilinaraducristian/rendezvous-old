# CREATE TABLE `USER_ENTITY`
# (
#     `id`         char(36) PRIMARY KEY,
#     `first_name` varchar(255),
#     `last_name`  varchar(255),
#     `username`   varchar(255),
#     `password`   varchar(255),
#     `email`      varchar(255)
# );

CREATE DATABASE `capp`;

CREATE TABLE `capp`.`servers`
(
    `id`      int PRIMARY KEY AUTO_INCREMENT,
    `user_id` char(36),
    `name`    varchar(255) NOT NULL
);

CREATE TABLE `capp`.`invitations`
(
    `id`              int PRIMARY KEY AUTO_INCREMENT,
    `server_id`       int,
    `invitation`      varchar(255) NOT NULL,
    `expiration_date` datetime     NOT NULL
);

CREATE TABLE `capp`.`members`
(
    `id`        int PRIMARY KEY AUTO_INCREMENT,
    `user_id`   char(36),
    `server_id` int
);

CREATE TABLE `capp`.`channels`
(
    `id`        int PRIMARY KEY AUTO_INCREMENT,
    `server_id` int,
    `name`      varchar(255)
);

CREATE TABLE `capp`.`messages`
(
    `id`         int PRIMARY KEY AUTO_INCREMENT,
    `user_id`    char(36),
    `channel_id` int,
    `text`       varchar(255)
);



ALTER TABLE `capp`.`members`
    ADD UNIQUE `member_index` (`user_id`, `server_id`);
ALTER TABLE `capp`.`channels`
    ADD UNIQUE `channel_index` (`server_id`, `name`);

ALTER TABLE `capp`.`servers`
    ADD FOREIGN KEY (`user_id`) REFERENCES `keycloak`.`USER_ENTITY` (`id`);

ALTER TABLE `capp`.`invitations`
    ADD FOREIGN KEY (`server_id`) REFERENCES `capp`.`servers` (`id`);

ALTER TABLE `capp`.`members`
    ADD FOREIGN KEY (`user_id`) REFERENCES `keycloak`.`USER_ENTITY` (`id`);

ALTER TABLE `capp`.`members`
    ADD FOREIGN KEY (`server_id`) REFERENCES `capp`.`servers` (`id`);

ALTER TABLE `capp`.`channels`
    ADD FOREIGN KEY (`server_id`) REFERENCES `capp`.`servers` (`id`);

ALTER TABLE `capp`.`messages`
    ADD FOREIGN KEY (`user_id`) REFERENCES `keycloak`.`USER_ENTITY` (`id`);

ALTER TABLE `capp`.`messages`
    ADD FOREIGN KEY (`channel_id`) REFERENCES `capp`.`channels` (`id`);


# SELECT *
# FROM `capp`.`invitations`
# WHERE invitation = 'cad05176-b37f-4354-ad20-797d2f638f5d';
#
# SELECT s.`id`      AS `server_id`,
#        s.`name`    AS `server_name`,
#        c.`id`      AS `channel_id`,
#        c.`name`    AS `channel_name`,
#        m.`id`      AS `message_id`,
#        m.`user_id` AS `sender`,
#        m.`text`    AS `message`
# FROM `capp`.`servers` s
#          JOIN `capp`.`members` on `s`.id = `members`.`server_id`
#          LEFT JOIN `capp`.`channels` c ON s.id = c.server_id
#          LEFT JOIN `capp`.`messages` m ON m.channel_id = c.id
# WHERE `members`.`user_id` = '509652db-483c-4328-85b1-120573723b3a'
# ORDER BY `server_id`, `channel_id`;
#
# SELECT s.`id`      AS `server_id`,
#        s.`name`    AS `server_name`,
#        c.`id`      AS `channel_id`,
#        c.`name`    AS `channel_name`,
#        m.`id`      AS `message_id`,
#        m.`user_id` AS `sender`,
#        m.`text`    AS `message`
# FROM `capp`.`servers` s
#          LEFT JOIN `capp`.`channels` c ON s.id = c.server_id
#          LEFT JOIN `capp`.`messages` m ON m.channel_id = c.id
# WHERE s.id = 1;
#
# SELECT s.`id`         AS `server_id`,
#        s.`name`       AS `server_name`,
#        c.`id`         AS `channel_id`,
#        c.`name`       AS `channel_name`,
#        m.`channel_id` AS `message_channel`,
#        m.`user_id`    AS `sender`,
#        m.`text`       AS `message`
# FROM `capp`.`servers` s
#          LEFT JOIN `capp`.`channels` c ON s.id = c.server_id
#          LEFT JOIN `capp`.`messages` m ON m.channel_id = c.id
# WHERE s.id = 1;
#
# INSERT INTO `capp`.`servers` (user_id, name)
# VALUES ('509652db-483c-4328-85b1-120573723b3a', 'root@localhost');
#
# INSERT INTO `capp`.`members` (user_id, server_id)
# VALUES ('509652db-483c-4328-85b1-120573723b3a', 1);
# INSERT INTO `capp`.`channels` (server_id, name)
# VALUES (1, 'vc');
#
# INSERT INTO `capp`.`messages` (user_id, channel_id, text)
# VALUES ('509652db-483c-4328-85b1-120573723b3a', 1, 'Alt mesaj');
