CREATE TABLE IF NOT EXISTS `users` (
  `username` varchar(45) NOT NULL DEFAULT '',
  `password` varchar(258) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_roles` (
  `username` varchar(45) NOT NULL DEFAULT '',
  `role` varchar(45) NOT NULL DEFAULT '',
  FOREIGN KEY (`username`) REFERENCES `users`(`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `people` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` varchar(25) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `born` int DEFAULT NULL,
  `nationality` varchar(3) DEFAULT NULL,
  `features` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
