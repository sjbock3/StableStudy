-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema stablestudy
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema stablestudy
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `stablestudy` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `stablestudy` ;

-- -----------------------------------------------------
-- Table `stablestudy`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`user` (
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(30) NULL,
  `namef` VARCHAR(20) NULL,
  `namel` VARCHAR(20) NULL,
  `rewardPoints` INT NULL,
  `password` VARCHAR(20) NULL,
  `usertype` VARCHAR(9) NULL,
  `online` TINYINT(1) NULL,
  PRIMARY KEY (`username`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`building`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`building` (
  `buildingID` INT NOT NULL,
  `bName` VARCHAR(25) NULL,
  `closedAtNight` TINYINT(1) NULL,
  `onCampus` TINYINT(1) NULL,
  `address` VARCHAR(45) NULL,
  PRIMARY KEY (`buildingID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`room` (
  `id` INT NOT NULL,
  `number` INT NULL,
  `buidlingID:FK` INT NULL,
  `chairs` INT NULL,
  `computers` INT NULL,
  `whiteboards` INT NULL,
  `printer` INT NULL,
  `projectors` INT NULL,
  `restricted` TINYINT(1) NULL,
  `picturePath` VARCHAR(100) NULL,
  PRIMARY KEY (`id`),
  INDEX `buildingID_idx` (`buidlingID:FK` ASC),
  CONSTRAINT `buildingID`
    FOREIGN KEY (`buidlingID:FK`)
    REFERENCES `stablestudy`.`building` (`buildingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`favorites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`favorites` (
  `favID` VARCHAR(45) NOT NULL,
  `username` VARCHAR(20) NULL,
  `favRoom` INT NULL,
  PRIMARY KEY (`favID`),
  INDEX `username_idx` (`username` ASC),
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `stablestudy`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`friends`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`friends` (
  `friendID` INT NOT NULL,
  `user1` VARCHAR(20) NULL,
  `user2` VARCHAR(20) NULL,
  `reqAccepted` TINYINT(1) NULL,
  PRIMARY KEY (`friendID`),
  INDEX `user1_idx` (`user1` ASC),
  INDEX `user2_idx` (`user2` ASC),
  CONSTRAINT `user1`
    FOREIGN KEY (`user1`)
    REFERENCES `stablestudy`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user2`
    FOREIGN KEY (`user2`)
    REFERENCES `stablestudy`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`comments` (
  `commentID` INT NOT NULL,
  `username` VARCHAR(20) NULL,
  `details` VARCHAR(140) NULL,
  `rating` INT NULL,
  `roomID` INT NULL,
  PRIMARY KEY (`commentID`),
  INDEX `username(20)_idx` (`username` ASC),
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `stablestudy`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`reservation` (
  `resID` INT NOT NULL,
  `username` VARCHAR(20) NULL,
  `roomID:FK` INT NULL,
  `timeS` DATETIME NULL,
  `timeE` DATETIME NULL,
  PRIMARY KEY (`resID`),
  INDEX `roomID_idx` (`roomID:FK` ASC),
  INDEX `username_idx` (`username` ASC),
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `stablestudy`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `roomID`
    FOREIGN KEY (`roomID:FK`)
    REFERENCES `stablestudy`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`meetings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`meetings` (
  `meetingID` INT NOT NULL,
  `username` VARCHAR(20) NULL,
  `roomID` INT NULL,
  `timeS` DATETIME NULL,
  `timeE` DATETIME NULL,
  PRIMARY KEY (`meetingID`),
  INDEX `username_idx` (`username` ASC),
  INDEX `roomID_idx` (`roomID` ASC),
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `stablestudy`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `roomID`
    FOREIGN KEY (`roomID`)
    REFERENCES `stablestudy`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`meetingUsers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`meetingUsers` (
  `uID` INT NOT NULL,
  `meetingID` INT NULL,
  `username` VARCHAR(20) NULL,
  PRIMARY KEY (`uID`),
  INDEX `meetingID_idx` (`meetingID` ASC),
  INDEX `username_idx` (`username` ASC),
  CONSTRAINT `meetingID`
    FOREIGN KEY (`meetingID`)
    REFERENCES `stablestudy`.`meetings` (`meetingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `stablestudy`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
