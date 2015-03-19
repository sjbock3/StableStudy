-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`user` (
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
-- Table `mydb`.`building`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`building` (
  `buildingID` INT NOT NULL,
  `bName` VARCHAR(25) NULL,
  `closedAtNight` TINYINT(1) NULL,
  `onCampus` TINYINT(1) NULL,
  `address` VARCHAR(45) NULL,
  PRIMARY KEY (`buildingID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`room` (
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
    REFERENCES `mydb`.`building` (`buildingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`favorites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`favorites` (
  `favID` VARCHAR(45) NOT NULL,
  `username` VARCHAR(20) NULL,
  `favRoom` INT NULL,
  PRIMARY KEY (`favID`),
  INDEX `username_idx` (`username` ASC),
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `mydb`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`friends`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`friends` (
  `friendID` INT NOT NULL,
  `user1` VARCHAR(20) NULL,
  `user2` VARCHAR(20) NULL,
  `reqAccepted` TINYINT(1) NULL,
  PRIMARY KEY (`friendID`),
  INDEX `user1_idx` (`user1` ASC),
  INDEX `user2_idx` (`user2` ASC),
  CONSTRAINT `user1`
    FOREIGN KEY (`user1`)
    REFERENCES `mydb`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user2`
    FOREIGN KEY (`user2`)
    REFERENCES `mydb`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`comments` (
  `commentID` INT NOT NULL,
  `username` VARCHAR(20) NULL,
  `details` VARCHAR(140) NULL,
  `rating` INT NULL,
  `roomID` INT NULL,
  PRIMARY KEY (`commentID`),
  INDEX `username(20)_idx` (`username` ASC),
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `mydb`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`reservation` (
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
    REFERENCES `mydb`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `roomID`
    FOREIGN KEY (`roomID:FK`)
    REFERENCES `mydb`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`meetings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`meetings` (
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
    REFERENCES `mydb`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `roomID`
    FOREIGN KEY (`roomID`)
    REFERENCES `mydb`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`meetingUsers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`meetingUsers` (
  `uID` INT NOT NULL,
  `meetingID` INT NULL,
  `username` VARCHAR(20) NULL,
  PRIMARY KEY (`uID`),
  INDEX `meetingID_idx` (`meetingID` ASC),
  INDEX `username_idx` (`username` ASC),
  CONSTRAINT `meetingID`
    FOREIGN KEY (`meetingID`)
    REFERENCES `mydb`.`meetings` (`meetingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `mydb`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
