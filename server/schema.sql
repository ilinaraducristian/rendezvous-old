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
    `user_id` char(36)     NOT NULL,
    `name`    varchar(255) NOT NULL
);

CREATE TABLE `capp`.`invitations`
(
    `id`              int PRIMARY KEY AUTO_INCREMENT,
    `server_id`       int          NOT NULL,
    `invitation`      varchar(255) NOT NULL,
    `expiration_date` datetime     NOT NULL
);

CREATE TABLE `capp`.`members`
(
    `id`        int PRIMARY KEY AUTO_INCREMENT,
    `user_id`   char(36) NOT NULL,
    `server_id` int      NOT NULL
);

CREATE TABLE `capp`.`channels`
(
    `id`        int PRIMARY KEY AUTO_INCREMENT,
    `server_id` int          NOT NULL,
    `name`      varchar(255) NOT NULL
);

CREATE TABLE `capp`.`messages`
(
    `id`         int PRIMARY KEY AUTO_INCREMENT,
    `user_id`    char(36)     NOT NULL,
    `channel_id` int          NOT NULL,
    `timestamp`  datetime     NOT NULL,
    `text`       varchar(255) NOT NULL
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
