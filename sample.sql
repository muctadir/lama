-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: lama-db:3306
-- Generation Time: Apr 23, 2023 at 03:55 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lama`
--

-- --------------------------------------------------------

--
-- Table structure for table `alembic_version`
--

CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `alembic_version`
--

INSERT INTO `alembic_version` (`version_num`) VALUES
('04f8f77f4ae3');

-- --------------------------------------------------------

--
-- Table structure for table `artifact`
--

CREATE TABLE `artifact` (
  `id` int NOT NULL,
  `identifier` varchar(64) NOT NULL,
  `data` text NOT NULL,
  `start` int DEFAULT NULL,
  `end` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `p_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `artifact`
--

INSERT INTO `artifact` (`id`, `identifier`, `data`, `start`, `end`, `parent_id`, `p_id`) VALUES
(1, '2FA3F', 'I waited forever on the waiters and waited even longer on the food itself. To make matters worse, it was disgusting, never coming here again!', NULL, NULL, NULL, 1),
(2, '2FA3F', 'The food was tasty and well presented, but of course as usual with all these posh restaurants, the portions were tiny... only come here if you\'re rich', NULL, NULL, NULL, 1),
(3, '2FA3F', 'At least it was clean...', NULL, NULL, NULL, 1),
(4, '2FA3F', 'The food was tasty', 0, 18, 2, 1),
(5, '2FA3F', 'and well presented, ', 19, 39, 2, 1),
(6, '2FA3F', ' the portions were tiny... ', 94, 121, 2, 1),
(7, '2FA3F', 'I waited forever on the waiters', 0, 31, 1, 1),
(8, '2FA3F', ' waited even longer on the food itself. ', 35, 75, 1, 1),
(9, '2FA3F', 'it was disgusting, ', 98, 117, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `artifact_change`
--

CREATE TABLE `artifact_change` (
  `id` int NOT NULL,
  `change_type` enum('create','name','description','split','merge','theme_children','labelled','deleted') NOT NULL,
  `description` text,
  `name` text NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `u_id` int NOT NULL,
  `p_id` int NOT NULL,
  `i_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `artifact_change`
--

INSERT INTO `artifact_change` (`id`, `change_type`, `description`, `name`, `timestamp`, `u_id`, `p_id`, `i_id`) VALUES
(1, 'create', NULL, '1', '2023-04-21 19:55:34', 1, 1, 1),
(2, 'create', NULL, '2', '2023-04-21 19:55:34', 1, 1, 2),
(3, 'create', NULL, '3', '2023-04-21 19:55:34', 1, 1, 3),
(4, 'split', '2', '4', '2023-04-21 19:56:05', 1, 1, 4),
(5, 'split', '2', '5', '2023-04-21 19:56:13', 1, 1, 5),
(6, 'split', '2', '6', '2023-04-21 19:56:20', 1, 1, 6),
(7, 'labelled', 'label ; Point of review ; Tasty', '4', '2023-04-21 19:56:48', 1, 1, 4),
(8, 'labelled', 'label ; Point of review ; Clean', '3', '2023-04-21 19:57:04', 1, 1, 3),
(9, 'labelled', 'label ; Point of review ; Small portion', '6', '2023-04-21 19:57:15', 1, 1, 6),
(10, 'split', '1', '7', '2023-04-21 19:57:22', 1, 1, 7),
(11, 'split', '1', '8', '2023-04-21 19:57:28', 1, 1, 8),
(12, 'split', '1', '9', '2023-04-21 19:57:37', 1, 1, 9),
(13, 'labelled', 'label ; Point of review ; Disgusting', '9', '2023-04-21 19:58:22', 1, 1, 9),
(14, 'labelled', 'label ; Point of review ; Inattentive', '7', '2023-04-21 19:58:42', 1, 1, 7),
(15, 'labelled', 'label ; Point of review ; Slow', '8', '2023-04-21 19:59:19', 1, 1, 8),
(16, 'labelled', 'label ; Point of review ; Well presented', '5', '2023-04-21 19:59:30', 1, 1, 5),
(17, 'labelled', 'label ; Point of review ; Slow', '7', '2023-04-23 15:51:53', 2, 1, 7),
(18, 'labelled', 'label ; Point of review ; Disgusting', '3', '2023-04-23 15:53:51', 2, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `highlight`
--

CREATE TABLE `highlight` (
  `u_id` int NOT NULL,
  `a_id` int NOT NULL,
  `p_id` int NOT NULL,
  `id` int NOT NULL,
  `start` int NOT NULL,
  `end` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `label`
--

CREATE TABLE `label` (
  `id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `lt_id` int NOT NULL,
  `description` text NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `p_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `label`
--

INSERT INTO `label` (`id`, `name`, `lt_id`, `description`, `deleted`, `child_id`, `p_id`) VALUES
(1, 'Tasty', 1, 'The food was tasty', 0, NULL, 1),
(2, 'Bland', 1, 'The food was bland', 0, NULL, 1),
(3, 'Disgusting', 1, 'The food was not pleasant', 0, NULL, 1),
(4, 'Crowded', 1, 'The restaurant was too crowded', 0, NULL, 1),
(5, 'Dirty', 1, 'The restaurant was dirty', 0, NULL, 1),
(6, 'Clean', 1, 'The restaurant was clean', 0, NULL, 1),
(7, 'Inattentive', 1, 'Service was slow', 0, NULL, 1),
(8, 'Slow', 1, 'Long wait time for food', 0, NULL, 1),
(9, 'Queue', 1, 'Long wait time for a table', 0, NULL, 1),
(10, 'Quick', 1, 'Food was prepared quickly', 0, NULL, 1),
(11, 'Attentive', 1, 'Service was fast', 0, NULL, 1),
(12, 'Well presented', 1, 'Food was presented attractively', 0, NULL, 1),
(13, 'Small portion', 1, 'Food portion is too small', 0, NULL, 1),
(14, 'Large portion', 1, 'Food portions are plentiful', 0, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `labelling`
--

CREATE TABLE `labelling` (
  `u_id` int NOT NULL,
  `a_id` int NOT NULL,
  `lt_id` int NOT NULL,
  `l_id` int NOT NULL,
  `p_id` int NOT NULL,
  `remark` text,
  `time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `labelling`
--

INSERT INTO `labelling` (`u_id`, `a_id`, `lt_id`, `l_id`, `p_id`, `remark`, `time`) VALUES
(1, 3, 1, 6, 1, 'Although it sounds like a bad review overall...', '00:00:16'),
(1, 4, 1, 1, 1, 'The food was tasty', '00:00:19'),
(1, 5, 1, 12, 1, 'food looked good', '00:00:10'),
(1, 6, 1, 13, 1, 'Disappointing', '00:00:10'),
(1, 7, 1, 7, 1, 'waiters -> service', '00:00:19'),
(1, 8, 1, 8, 1, 'food took a long time to arrive', '00:00:16'),
(1, 9, 1, 3, 1, 'as the artifact says', '00:00:43'),
(2, 3, 1, 3, 1, 'This label usage is wrong, it tries to use the unclear context of the review to assume that there must be something wrong with the restaurant, and that it is probably the food', '00:01:28'),
(2, 7, 1, 8, 1, 'This label usage is wrong, as the \"Slow\" label refers to waiting for food, not waiting for service', '00:01:04');

-- --------------------------------------------------------

--
-- Table structure for table `label_change`
--

CREATE TABLE `label_change` (
  `id` int NOT NULL,
  `change_type` enum('create','name','description','split','merge','theme_children','labelled','deleted') NOT NULL,
  `description` text,
  `name` text NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `u_id` int NOT NULL,
  `p_id` int NOT NULL,
  `i_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `label_change`
--

INSERT INTO `label_change` (`id`, `change_type`, `description`, `name`, `timestamp`, `u_id`, `p_id`, `i_id`) VALUES
(1, 'create', 'Point of review', 'Tasty', '2023-04-21 19:42:26', 1, 1, 1),
(2, 'create', 'Point of review', 'Bland', '2023-04-21 19:42:51', 1, 1, 2),
(3, 'create', 'Point of review', 'Disgusting', '2023-04-21 19:43:03', 1, 1, 3),
(4, 'create', 'Point of review', 'Crowded', '2023-04-21 19:43:28', 1, 1, 4),
(5, 'create', 'Point of review', 'Dirty', '2023-04-21 19:44:20', 1, 1, 5),
(6, 'create', 'Point of review', 'Clean', '2023-04-21 19:44:28', 1, 1, 6),
(7, 'create', 'Point of review', 'Inattentive', '2023-04-21 19:44:44', 1, 1, 7),
(8, 'create', 'Point of review', 'Slow', '2023-04-21 19:45:09', 1, 1, 8),
(9, 'create', 'Point of review', 'Queue', '2023-04-21 19:45:24', 1, 1, 9),
(10, 'create', 'Point of review', 'Quick', '2023-04-21 19:45:53', 1, 1, 10),
(11, 'create', 'Point of review', 'Attentive', '2023-04-21 19:46:05', 1, 1, 11),
(12, 'create', 'Point of review', 'Well presented', '2023-04-21 19:46:25', 1, 1, 12),
(13, 'create', 'Point of review', 'Small portion', '2023-04-21 19:46:34', 1, 1, 13),
(14, 'create', 'Point of review', 'Large portion', '2023-04-21 19:46:53', 1, 1, 14);

-- --------------------------------------------------------

--
-- Table structure for table `label_to_theme`
--

CREATE TABLE `label_to_theme` (
  `p_id` int DEFAULT NULL,
  `t_id` int NOT NULL,
  `l_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `label_to_theme`
--

INSERT INTO `label_to_theme` (`p_id`, `t_id`, `l_id`) VALUES
(1, 1, 1),
(1, 1, 12),
(1, 1, 14),
(1, 2, 2),
(1, 2, 3),
(1, 2, 13),
(1, 4, 10),
(1, 4, 11),
(1, 5, 7),
(1, 5, 8),
(1, 5, 9),
(1, 7, 6),
(1, 8, 4),
(1, 8, 5);

-- --------------------------------------------------------

--
-- Table structure for table `label_type`
--

CREATE TABLE `label_type` (
  `id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `p_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `label_type`
--

INSERT INTO `label_type` (`id`, `name`, `p_id`) VALUES
(1, 'Point of review', 1);

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE `membership` (
  `p_id` int NOT NULL,
  `u_id` int NOT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `membership`
--

INSERT INTO `membership` (`p_id`, `u_id`, `admin`, `deleted`) VALUES
(1, 1, 1, 0),
(1, 2, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` text,
  `criteria` int DEFAULT NULL,
  `frozen` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `name`, `description`, `criteria`, `frozen`) VALUES
(1, 'Restaurant Reviews', 'A sample project depicting artifacts containing restaurant reviews. To handle the difference between extensive and short reviews, larger reviews should be split into shorter ones containing one main point, and then each point is later categorized into a theme.', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `theme`
--

CREATE TABLE `theme` (
  `id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` text,
  `deleted` tinyint(1) DEFAULT NULL,
  `super_theme_id` int DEFAULT NULL,
  `p_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `theme`
--

INSERT INTO `theme` (`id`, `name`, `description`, `deleted`, `super_theme_id`, `p_id`) VALUES
(1, 'Good Food', 'All positive points related to food', 0, 3, 1),
(2, 'Bad Food', 'All negative points related to food', 0, 3, 1),
(3, 'Food', 'All points related to food', 0, NULL, 1),
(4, 'Good Service', 'All positive points related to service', 0, 6, 1),
(5, 'Bad Service', 'All negative points related to service', 0, 6, 1),
(6, 'Service', 'All points related to service', 0, NULL, 1),
(7, 'Good Decor', 'All positive points related to the presentation of the restaurant itself', 0, 9, 1),
(8, 'Bad Decor', 'All negative points related to the presentation of the restaurant itself', 0, 9, 1),
(9, 'Decor', 'All points related to the presentation of the restaurant itself', 0, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `theme_change`
--

CREATE TABLE `theme_change` (
  `id` int NOT NULL,
  `change_type` enum('create','name','description','split','merge','theme_children','labelled','deleted') NOT NULL,
  `description` text,
  `name` text NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `u_id` int NOT NULL,
  `p_id` int NOT NULL,
  `i_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `theme_change`
--

INSERT INTO `theme_change` (`id`, `change_type`, `description`, `name`, `timestamp`, `u_id`, `p_id`, `i_id`) VALUES
(1, 'create', NULL, 'Good Food', '2023-04-21 19:48:15', 1, 1, 1),
(2, 'theme_children', 'label ; Tasty,Well presented,Large portion', 'Good Food', '2023-04-21 19:48:15', 1, 1, 1),
(3, 'create', NULL, 'Bad Food', '2023-04-21 19:48:48', 1, 1, 2),
(4, 'theme_children', 'label ; Bland,Disgusting,Small portion', 'Bad Food', '2023-04-21 19:48:48', 1, 1, 2),
(5, 'create', NULL, 'Food', '2023-04-21 19:49:07', 1, 1, 3),
(6, 'theme_children', 'subtheme ; Good Food,Bad Food', 'Food', '2023-04-21 19:49:07', 1, 1, 3),
(7, 'create', NULL, 'Good Service', '2023-04-21 19:50:01', 1, 1, 4),
(8, 'theme_children', 'label ; Quick,Attentive', 'Good Service', '2023-04-21 19:50:02', 1, 1, 4),
(9, 'create', NULL, 'Bad service', '2023-04-21 19:50:58', 1, 1, 5),
(10, 'theme_children', 'label ; Inattentive,Slow,Queue', 'Bad service', '2023-04-21 19:50:58', 1, 1, 5),
(11, 'create', NULL, 'Service', '2023-04-21 19:51:15', 1, 1, 6),
(12, 'theme_children', 'subtheme ; Good Service,Bad service', 'Service', '2023-04-21 19:51:15', 1, 1, 6),
(13, 'create', NULL, 'Good Decor', '2023-04-21 19:52:02', 1, 1, 7),
(14, 'theme_children', 'label ; Clean', 'Good Decor', '2023-04-21 19:52:02', 1, 1, 7),
(15, 'create', NULL, 'Bad decor', '2023-04-21 19:52:19', 1, 1, 8),
(16, 'theme_children', 'label ; Crowded,Dirty', 'Bad decor', '2023-04-21 19:52:20', 1, 1, 8),
(17, 'create', NULL, 'Decor', '2023-04-21 19:52:28', 1, 1, 9),
(18, 'theme_children', 'subtheme ; Good Decor,Bad decor', 'Decor', '2023-04-21 19:52:28', 1, 1, 9),
(19, 'name', 'Bad Service', 'Bad service', '2023-04-21 19:52:36', 1, 1, 5),
(20, 'name', 'Bad Decor', 'Bad decor', '2023-04-21 19:52:45', 1, 1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(128) NOT NULL,
  `email` varchar(320) NOT NULL,
  `status` enum('pending','approved','denied','deleted') NOT NULL,
  `description` text,
  `super_admin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `status`, `description`, `super_admin`) VALUES
(1, 'admin', 'pbkdf2:sha256:260000$Xg6fOSEe3Kz0K5eG$b521e4b6fd1fb64486af95e508b39b7d8e111571b65aeffe500c910f7770cf06', '', 'approved', 'Auto-generated super admin', 1),
(2, 'John Doe', 'pbkdf2:sha256:260000$FLJ5WTnlh0sWDF1z$02a3b31525fca7e42bbafab99f24548637ccca3de2a66ae72cea2a916d3bef3b', 'faux@email.com', 'approved', 'I\'m an inattentive labeller', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alembic_version`
--
ALTER TABLE `alembic_version`
  ADD PRIMARY KEY (`version_num`);

--
-- Indexes for table `artifact`
--
ALTER TABLE `artifact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `artifact_change`
--
ALTER TABLE `artifact_change`
  ADD PRIMARY KEY (`id`),
  ADD KEY `i_id` (`i_id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `highlight`
--
ALTER TABLE `highlight`
  ADD PRIMARY KEY (`id`),
  ADD KEY `a_id` (`a_id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `label`
--
ALTER TABLE `label`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_uniqueness` (`p_id`,`name`),
  ADD KEY `child_id` (`child_id`),
  ADD KEY `lt_id` (`lt_id`);

--
-- Indexes for table `labelling`
--
ALTER TABLE `labelling`
  ADD PRIMARY KEY (`u_id`,`a_id`,`lt_id`),
  ADD KEY `a_id` (`a_id`),
  ADD KEY `l_id` (`l_id`),
  ADD KEY `lt_id` (`lt_id`),
  ADD KEY `p_id` (`p_id`);

--
-- Indexes for table `label_change`
--
ALTER TABLE `label_change`
  ADD PRIMARY KEY (`id`),
  ADD KEY `i_id` (`i_id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `label_to_theme`
--
ALTER TABLE `label_to_theme`
  ADD PRIMARY KEY (`t_id`,`l_id`),
  ADD KEY `l_id` (`l_id`),
  ADD KEY `p_id` (`p_id`);

--
-- Indexes for table `label_type`
--
ALTER TABLE `label_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_uniqueness` (`p_id`,`name`);

--
-- Indexes for table `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`p_id`,`u_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `theme`
--
ALTER TABLE `theme`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_uniqueness` (`p_id`,`name`),
  ADD KEY `super_theme_id` (`super_theme_id`);

--
-- Indexes for table `theme_change`
--
ALTER TABLE `theme_change`
  ADD PRIMARY KEY (`id`),
  ADD KEY `i_id` (`i_id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artifact`
--
ALTER TABLE `artifact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `artifact_change`
--
ALTER TABLE `artifact_change`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `highlight`
--
ALTER TABLE `highlight`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `label`
--
ALTER TABLE `label`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `label_change`
--
ALTER TABLE `label_change`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `label_type`
--
ALTER TABLE `label_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `theme`
--
ALTER TABLE `theme`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `theme_change`
--
ALTER TABLE `theme_change`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `artifact`
--
ALTER TABLE `artifact`
  ADD CONSTRAINT `artifact_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `artifact_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `artifact` (`id`);

--
-- Constraints for table `artifact_change`
--
ALTER TABLE `artifact_change`
  ADD CONSTRAINT `artifact_change_ibfk_1` FOREIGN KEY (`i_id`) REFERENCES `artifact` (`id`),
  ADD CONSTRAINT `artifact_change_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `artifact_change_ibfk_3` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `highlight`
--
ALTER TABLE `highlight`
  ADD CONSTRAINT `highlight_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `artifact` (`id`),
  ADD CONSTRAINT `highlight_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `highlight_ibfk_3` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `label`
--
ALTER TABLE `label`
  ADD CONSTRAINT `label_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `label` (`id`),
  ADD CONSTRAINT `label_ibfk_2` FOREIGN KEY (`lt_id`) REFERENCES `label_type` (`id`),
  ADD CONSTRAINT `label_ibfk_3` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`);

--
-- Constraints for table `labelling`
--
ALTER TABLE `labelling`
  ADD CONSTRAINT `labelling_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `artifact` (`id`),
  ADD CONSTRAINT `labelling_ibfk_2` FOREIGN KEY (`l_id`) REFERENCES `label` (`id`),
  ADD CONSTRAINT `labelling_ibfk_3` FOREIGN KEY (`lt_id`) REFERENCES `label_type` (`id`),
  ADD CONSTRAINT `labelling_ibfk_4` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `labelling_ibfk_5` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `label_change`
--
ALTER TABLE `label_change`
  ADD CONSTRAINT `label_change_ibfk_1` FOREIGN KEY (`i_id`) REFERENCES `label` (`id`),
  ADD CONSTRAINT `label_change_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `label_change_ibfk_3` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `label_to_theme`
--
ALTER TABLE `label_to_theme`
  ADD CONSTRAINT `label_to_theme_ibfk_1` FOREIGN KEY (`l_id`) REFERENCES `label` (`id`),
  ADD CONSTRAINT `label_to_theme_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `label_to_theme_ibfk_3` FOREIGN KEY (`t_id`) REFERENCES `theme` (`id`);

--
-- Constraints for table `label_type`
--
ALTER TABLE `label_type`
  ADD CONSTRAINT `label_type_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`);

--
-- Constraints for table `membership`
--
ALTER TABLE `membership`
  ADD CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `membership_ibfk_2` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `theme`
--
ALTER TABLE `theme`
  ADD CONSTRAINT `theme_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `theme_ibfk_2` FOREIGN KEY (`super_theme_id`) REFERENCES `theme` (`id`);

--
-- Constraints for table `theme_change`
--
ALTER TABLE `theme_change`
  ADD CONSTRAINT `theme_change_ibfk_1` FOREIGN KEY (`i_id`) REFERENCES `theme` (`id`),
  ADD CONSTRAINT `theme_change_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `theme_change_ibfk_3` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
