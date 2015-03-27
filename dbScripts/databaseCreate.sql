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
CREATE SCHEMA IF NOT EXISTS `stablestudy` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `stablestudy` ;

-- -----------------------------------------------------
-- Table `stablestudy`.`buildings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`buildings` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`buildings` (
  `buildingName` VARCHAR(100) NOT NULL,
  `closedAtNight` TINYINT(1) NULL,
  `onCampus` TINYINT NULL,
  `address` VARCHAR(100) NULL,
  PRIMARY KEY (`buildingName`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`users` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`users` (
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(30) NOT NULL,
  `fName` VARCHAR(20) NOT NULL,
  `lName` VARCHAR(20) NOT NULL,
  `school` VARCHAR(45) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`rooms`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`rooms` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`rooms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `number` INT NOT NULL,
  `buildingName` VARCHAR(100) NULL,
  `chairs` INT NULL,
  `computers` INT NULL,
  `whiteboards` INT NULL,
  `printers` INT NULL,
  `projectors` INT NULL,
  `restricted` TINYINT NULL,
  `pictureurl` VARCHAR(100) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `stablestudy`.`favorites`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `stablestudy`.`favorites` ;

CREATE TABLE IF NOT EXISTS `stablestudy`.`favorites` (
  `favID` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NULL,
  `favRoom` INT NULL,
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
    REFERENCES `stablestudy`.`rooms` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
