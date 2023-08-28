SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema nona_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `nona_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `nona_db` ;

-- -----------------------------------------------------
-- Table `nona_db`.`tb_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_category` (
  `id` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `img_url` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `img_url_UNIQUE` (`img_url` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_user` (
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `bus_user` TINYINT NOT NULL DEFAULT '0',
  `bus_api` VARCHAR(64) NULL DEFAULT NULL,
  `uid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `bus_api_UNIQUE` (`bus_api` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_business`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_business` (
  `id` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `description` VARCHAR(500) NULL DEFAULT NULL,
  `reviews` INT(10) UNSIGNED ZEROFILL NULL DEFAULT NULL,
  `rating` DECIMAL(4,3) UNSIGNED NULL DEFAULT NULL,
  `address` VARCHAR(100) NULL DEFAULT NULL,
  `category_id` INT(10) UNSIGNED ZEROFILL NULL DEFAULT NULL,
  `owner_user_id` INT(10) UNSIGNED ZEROFILL NULL DEFAULT NULL,
  `img_url` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `img_url_UNIQUE` (`img_url` ASC) VISIBLE,
  INDEX `bus2user_idx` (`owner_user_id` ASC) VISIBLE,
  INDEX `bus2cat_idx` (`category_id` ASC) VISIBLE,
  CONSTRAINT `bus2cat`
    FOREIGN KEY (`category_id`)
    REFERENCES `nona_db`.`tb_category` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL,
  CONSTRAINT `bus2user`
    FOREIGN KEY (`owner_user_id`)
    REFERENCES `nona_db`.`tb_user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_service`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_service` (
  `id` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `bus_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(500) NULL DEFAULT NULL,
  `base_price` DECIMAL(7,2) UNSIGNED NULL DEFAULT NULL,
  `img_url` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `bus_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `img_url_UNIQUE` (`img_url` ASC) VISIBLE,
  INDEX `service2bus_idx` (`bus_id` ASC) VISIBLE,
  CONSTRAINT `service2bus`
    FOREIGN KEY (`bus_id`)
    REFERENCES `nona_db`.`tb_business` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_service_add_ons`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_service_add_ons` (
  `id` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `service_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `price` DECIMAL(7,2) UNSIGNED NULL DEFAULT NULL,
  `allows_multiple` TINYINT UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`, `service_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `service_idx` (`service_id` ASC) VISIBLE,
  CONSTRAINT `addons2service`
    FOREIGN KEY (`service_id`)
    REFERENCES `nona_db`.`tb_service` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_service_actual_time_slots`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_service_actual_time_slots` (
  `id` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `service_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `starts` DATETIME NOT NULL,
  PRIMARY KEY (`id`, `service_id`, `starts`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `service_idx` (`service_id` ASC) VISIBLE,
  CONSTRAINT `actual_time2service`
    FOREIGN KEY (`service_id`)
    REFERENCES `nona_db`.`tb_service` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_order` (
  `id` INT(30) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `time_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `comments` VARCHAR(1024) NULL DEFAULT NULL,
  `name` VARCHAR(256) NULL DEFAULT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `status` ENUM('Confirmed', 'Ready', 'Progressing', 'Waiting', 'Cancelled', 'Completed', 'Missed') NOT NULL DEFAULT 'Confirmed',
  PRIMARY KEY (`id`, `user_id`, `time_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `time_id_UNIQUE` (`time_id` ASC) VISIBLE,
  INDEX `order2user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `order2actual_time`
    FOREIGN KEY (`time_id`)
    REFERENCES `nona_db`.`tb_service_actual_time_slots` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `order2user`
    FOREIGN KEY (`user_id`)
    REFERENCES `nona_db`.`tb_user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_add_ons_for_order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_add_ons_for_order` (
  `order_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `add_on_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `quantity` INT NOT NULL DEFAULT '1',
  PRIMARY KEY (`order_id`, `add_on_id`),
  INDEX `2add_on_idx` (`add_on_id` ASC) VISIBLE,
  CONSTRAINT `2add_on`
    FOREIGN KEY (`add_on_id`)
    REFERENCES `nona_db`.`tb_service_add_ons` (`id`),
  CONSTRAINT `add_on2order`
    FOREIGN KEY (`order_id`)
    REFERENCES `nona_db`.`tb_order` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_bus_opendays`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_bus_opendays` (
  `bus_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `starts` DATETIME NOT NULL,
  `ends` DATETIME NOT NULL,
  INDEX `opendays2bus_idx` (`bus_id` ASC) VISIBLE,
  CONSTRAINT `opendays2bus`
    FOREIGN KEY (`bus_id`)
    REFERENCES `nona_db`.`tb_business` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_service_weekly_time_slots`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_service_weekly_time_slots` (
  `service_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `starts` DATETIME NOT NULL,
  `slots` INT UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`service_id`, `starts`),
  CONSTRAINT `weekly_time2service`
    FOREIGN KEY (`service_id`)
    REFERENCES `nona_db`.`tb_service` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `nona_db`.`tb_userinfo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nona_db`.`tb_userinfo` (
  `id` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(256) NULL DEFAULT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `user_id` INT(10) UNSIGNED ZEROFILL NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `userinfo2user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `userinfo2user`
    FOREIGN KEY (`user_id`)
    REFERENCES `nona_db`.`tb_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 10001
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
