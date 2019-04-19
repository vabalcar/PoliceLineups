CREATE DATABASE `policeLineups` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `policeLineups`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users` (name, email) VALUES ('Pepa', 'pepa@email.cz');
INSERT INTO `users` (name, email) VALUES ('Pavel', 'pavel@email.cz');
