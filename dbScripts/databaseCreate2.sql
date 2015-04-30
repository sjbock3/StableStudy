-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema stablestudy
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `stablestudy` ;

-- -----------------------------------------------------
-- Schema stablestudy
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `stablestudy` DEFAULT CHARACTER SET utf8 ;
USE `stablestudy` ;

-- -----------------------------------------------------
-- Table `stablestudy`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`users` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`users` (
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(30) NOT NULL,
  `fName` VARCHAR(20) NOT NULL,
  `lName` VARCHAR(20) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `school` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`pictures`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`pictures` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`pictures` (
  `picture_id` INT NOT NULL AUTO_INCREMENT,
  `room_id` INT NULL DEFAULT NULL,
  `pictureurl` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`picture_id`),
  INDEX `room_id` (`room_id` ASC),
  CONSTRAINT `room_id`
    FOREIGN KEY (`room_id`)
    REFERENCES `stablestudy`.`locations` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`locations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`locations` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`locations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `latitude` VARCHAR(45) NULL DEFAULT NULL,
  `longitude` VARCHAR(45) NULL DEFAULT NULL,
  `floor` INT NULL DEFAULT NULL,
  `buildingName` VARCHAR(45) NULL DEFAULT NULL,
  `roomNumber` VARCHAR(20) NULL DEFAULT NULL,
  `classroom` TINYINT(1),
  `outdoor` TINYINT(1),
  `open_space` TINYINT(1),
  `study_room` TINYINT(1),
  `chairs` INT NULL DEFAULT NULL,
  `computers` INT NULL DEFAULT NULL,
  `whiteboards` INT NULL DEFAULT NULL,
  `printers` INT NULL DEFAULT NULL,
  `projectors` INT NULL DEFAULT NULL,
  `restricted` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `buildingName` (`buildingName` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`favorites`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`favorites` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`favorites` (
  `favID` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NULL DEFAULT NULL,
  `favRoom` INT NULL DEFAULT NULL,
  PRIMARY KEY (`favID`),
  INDEX `username_idx` (`username` ASC),
  INDEX `favRoom_idx` (`favRoom` ASC),
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `stablestudy`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `favRoom`
    FOREIGN KEY (`favRoom`)
    REFERENCES `stablestudy`.`locations` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`meetings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`meetings` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`meetings` (
  `meetingID` INT NOT NULL AUTO_INCREMENT,
  `hostName` VARCHAR(20) NULL DEFAULT NULL,
  `meetingTime` DATETIME NULL DEFAULT NULL,
  `roomID` INT NULL DEFAULT NULL,
  PRIMARY KEY (`meetingID`),
  INDEX `hostName_idx` (`hostName` ASC),
  INDEX `roomID_idx` (`roomID` ASC),
  CONSTRAINT `hostName`
    FOREIGN KEY (`hostName`)
    REFERENCES `stablestudy`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `roomID`
    FOREIGN KEY (`roomID`)
    REFERENCES `stablestudy`.`locations` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`meetingUsers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`meetingUsers` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`meetingUsers` (
  `meeting_id` INT NOT NULL,
  `users` VARCHAR(45) NOT NULL,
  INDEX `username_idx` (`users` ASC),
  PRIMARY KEY (`meeting_id`, `users`),
  CONSTRAINT `meeting_id`
    FOREIGN KEY (`meeting_id`)
    REFERENCES `stablestudy`.`meetings` (`meetingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `users`
    FOREIGN KEY (`users`)
    REFERENCES `stablestudy`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`reviews`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`reviews` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`reviews` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `room` INT NULL,
  `writer` VARCHAR(20) NULL,
  `comment` VARCHAR(140) NULL,
  PRIMARY KEY (`review_id`),
  INDEX `username_idx` (`writer` ASC),
  INDEX `roomID_idx` (`room` ASC),
  CONSTRAINT `room`
    FOREIGN KEY (`room`)
    REFERENCES `stablestudy`.`locations` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `writer`
    FOREIGN KEY (`writer`)
    REFERENCES `stablestudy`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `stablestudy`.`reviews`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`shares` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`shares` (
  `share_id` INT NOT NULL AUTO_INCREMENT,
  `shared_room` INT NULL,
  `host` VARCHAR(20) NULL,
  `other` VARCHAR(20) NULL,
  PRIMARY KEY (`share_id`),
  CONSTRAINT `shared_room`
    FOREIGN KEY (`shared_room`)
    REFERENCES `stablestudy`.`locations` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `other`
    FOREIGN KEY (`other`)
    REFERENCES `stablestudy`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `host`
  	FOREIGN KEY (`host`)
  	REFERENCES `stablestudy`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
