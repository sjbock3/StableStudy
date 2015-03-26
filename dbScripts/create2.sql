-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema stablestudy
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `stablestudy` ;

-- -----------------------------------------------------
-- Schema stablestudy
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `stablestudy` ;
-- -----------------------------------------------------
-- Schema stablestudy
-- -----------------------------------------------------
USE `stablestudy` ;

-- -----------------------------------------------------
-- Table `stablestudy`.`building`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`buildings` (
  `buildingID` INT(11) NOT NULL AUTO_INCREMENT,
  `bName` VARCHAR(25) NULL DEFAULT NULL,
  `closedAtNight` TINYINT(1) NULL DEFAULT NULL,
  `onCampus` TINYINT(1) NULL DEFAULT NULL,
  `address` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`buildingID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`users` (
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(30) NULL DEFAULT NULL,
  `namef` VARCHAR(20) NULL DEFAULT NULL,
  `namel` VARCHAR(20) NULL DEFAULT NULL,
  `rewardPoints` INT(11) NULL DEFAULT NULL,
  `password` VARCHAR(20) NULL DEFAULT NULL,
  `usertype` VARCHAR(9) NULL DEFAULT NULL,
  `online` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`username`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`favorites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`favorites` (
  `favID` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NULL DEFAULT NULL,
  `favRoom` INT(11) NULL,
  PRIMARY KEY (`favID`),
  INDEX `username_idx` (`username` ASC),
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `stablestudy`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`friends`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`friends` (
  `friendID` INT(11) NOT NULL,
  `user1` VARCHAR(20) NULL DEFAULT NULL,
  `user2` VARCHAR(20) NULL DEFAULT NULL,
  `reqAccepted` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`friendID`),
  INDEX `user1_idx` (`user1` ASC),
  INDEX `user2_idx` (`user2` ASC),
  CONSTRAINT `user1`
    FOREIGN KEY (`user1`)
    REFERENCES `stablestudy`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user2`
    FOREIGN KEY (`user2`)
    REFERENCES `stablestudy`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`rooms`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stablestudy`.`rooms` (
  `id` INT(11) NOT NULL,
  `number` INT(11) NULL DEFAULT NULL,
  `buidlingID:FK` INT(11) NULL DEFAULT NULL,
  `chairs` INT(11) NULL DEFAULT NULL,
  `computers` INT(11) NULL DEFAULT NULL,
  `whiteboards` INT(11) NULL DEFAULT NULL,
  `printer` INT(11) NULL DEFAULT NULL,
  `projectors` INT(11) NULL DEFAULT NULL,
  `restricted` TINYINT(1) NULL DEFAULT NULL,
  `picturePath` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `buildingID_idx` (`buidlingID:FK` ASC),
  CONSTRAINT `buildingID`
    FOREIGN KEY (`buidlingID:FK`)
    REFERENCES `stablestudy`.`buildings` (`buildingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
