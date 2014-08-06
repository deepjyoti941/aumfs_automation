-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2014 at 07:16 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `aumfs`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer_details`
--

CREATE TABLE IF NOT EXISTS `customer_details` (
  `customer_id` int(2) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(200) NOT NULL,
  `customer_address` varchar(250) NOT NULL,
  `customer_phone` varchar(50) NOT NULL,
  `black_listed` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=25 ;

--
-- Dumping data for table `customer_details`
--

INSERT INTO `customer_details` (`customer_id`, `customer_name`, `customer_address`, `customer_phone`, `black_listed`) VALUES
(17, 'deepjyot khakhlary', 'jyoti nagar', '9023675594', 0),
(18, 'deep das', 'rup nagar', '9854369055', 1),
(20, 'rohit sharma', 'kushal nagar', '8943675678', 0),
(21, 'arindum', 'arindum@gmail.com', '7667676712123', 0),
(22, 'Nihar Thakuria', 'nihar@gmail.com', '8945237867', 0),
(23, 'demo  name', 'demo@gmail.com', '893426787', 1),
(24, 'abdul singh', 'abdul@gmail.com', '8934235576', 0);

-- --------------------------------------------------------

--
-- Table structure for table `employee_details`
--

CREATE TABLE IF NOT EXISTS `employee_details` (
  `employee_id` int(5) NOT NULL AUTO_INCREMENT,
  `employee_name` varchar(200) NOT NULL,
  `employee_email` varchar(100) NOT NULL,
  `employee_mobile` int(10) NOT NULL,
  `employee_desc` varchar(200) NOT NULL DEFAULT 'no description available',
  `employee_photo` varchar(200) NOT NULL,
  `is_engaged` int(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `employee_details`
--

INSERT INTO `employee_details` (`employee_id`, `employee_name`, `employee_email`, `employee_mobile`, `employee_desc`, `employee_photo`, `is_engaged`) VALUES
(10, 'deepjyoti', 'deepjyoti@gmail.com', 2147483647, 'just demo description', 'images/uploads/10/employee.jpeg', 1),
(11, 'demo name', 'demo@gmail.com', 2147483647, 'demo descfor testing', 'images/uploads/11/employee.jpeg', 0),
(14, 'rohan sharmah', 'rohan@gmail.com', 904534887, 'just for testing desc', '/images/uploads/14/employee.jpeg', 1),
(15, 'Ashish Ranjan', 'ashish@gmail.com', 2147483647, 'desc', '/images/uploads/15/employee.jpeg', 1),
(16, 'Rohit singh', 'rohlt@gmail.com', 2147483647, 'demo for rohit', '/images/uploads/16/employee.jpeg', 1),
(17, 'Saurav Phukon', 'saurav@gmail.com', 2147483647, 'demo for saurav', '/images/uploads/17/employee.jpeg', 1),
(18, 'demo name', 'demo@email.com', 2147483647, 'demo desc', '/images/uploads/18/employee.jpeg', 1),
(19, 'demo for name', 'demoemail@gmail.com', 2147483647, 'demo desc', '', 0),
(20, 'shayam dev', 'shayam@gmail.com', 2147483647, 'demo desc for shayam', '/images/uploads/20/employee.jpeg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `oncall_customer_details`
--

CREATE TABLE IF NOT EXISTS `oncall_customer_details` (
  `oncall_service_id` int(10) NOT NULL AUTO_INCREMENT,
  `customer_id` int(10) NOT NULL,
  `service_name` varchar(200) NOT NULL,
  `assigned_employee_id` int(10) NOT NULL,
  `order_date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `act_date` date NOT NULL,
  `act_time` time NOT NULL,
  `completion_date` date NOT NULL,
  `completion_time` time NOT NULL,
  `helper_number` int(10) NOT NULL DEFAULT '0',
  `working_hour` int(5) NOT NULL DEFAULT '0',
  `billing_price` varchar(50) NOT NULL,
  `bill_number` varchar(100) NOT NULL,
  `description` varchar(200) NOT NULL,
  `order_status` int(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`oncall_service_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `oncall_customer_details`
--

INSERT INTO `oncall_customer_details` (`oncall_service_id`, `customer_id`, `service_name`, `assigned_employee_id`, `order_date_time`, `act_date`, `act_time`, `completion_date`, `completion_time`, `helper_number`, `working_hour`, `billing_price`, `bill_number`, `description`, `order_status`) VALUES
(1, 18, 'Carpentry', 15, '2014-08-03 18:59:02', '0000-00-00', '00:20:05', '0000-00-00', '00:00:00', 0, 0, '', '', '', 0),
(2, 20, 'Carpentry', 16, '2014-08-05 07:33:02', '2014-08-14', '00:00:00', '2014-08-14', '00:00:00', 2, 2, '450', 'DB123', 'extra 1kg cement used up', 0),
(5, 21, 'Air Conditioner repair', 15, '2014-08-05 16:44:29', '0000-00-00', '00:00:00', '0000-00-00', '00:00:00', 0, 0, '', '', 'extra wire used up', 0),
(6, 22, 'Electrical', 18, '2014-08-05 19:04:55', '2014-08-07', '00:00:00', '0000-00-00', '00:00:00', 0, 0, '', '', '', 0),
(7, 23, 'Plumbing', 16, '2014-08-06 10:13:47', '0000-00-00', '00:00:00', '0000-00-00', '00:00:00', 0, 0, '', '', '', 0),
(8, 24, 'Air Conditioner repair', 19, '2014-08-06 10:15:10', '2014-08-06', '15:45:00', '0000-00-00', '18:40:00', 1, 2, '400', 'B235', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `otj_service_type`
--

CREATE TABLE IF NOT EXISTS `otj_service_type` (
  `service_id` int(10) NOT NULL AUTO_INCREMENT,
  `service_name` varchar(100) NOT NULL,
  `service_frequency` varchar(100) NOT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `otj_service_type`
--

INSERT INTO `otj_service_type` (`service_id`, `service_name`, `service_frequency`) VALUES
(1, 'Electrical/Plumbing/Carpentry', 'Unlimited'),
(2, 'Air Conditioner', 'Half Yearly');

-- --------------------------------------------------------

--
-- Table structure for table `service_type`
--

CREATE TABLE IF NOT EXISTS `service_type` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `service_name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `service_type`
--

INSERT INTO `service_type` (`id`, `service_name`) VALUES
(1, 'Electrical'),
(2, 'Plumbing'),
(3, 'Carpentry'),
(4, 'Air Conditioner repair');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
