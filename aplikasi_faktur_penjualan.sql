-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2026 at 06:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aplikasi_faktur_penjualan`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id_customer` int(11) NOT NULL,
  `nama_customer` varchar(100) NOT NULL,
  `perusahaan_cust` varchar(100) DEFAULT NULL,
  `alamat` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id_customer`, `nama_customer`, `perusahaan_cust`, `alamat`) VALUES
(1, 'Firman Syah', 'PT Abadi Jaya', 'Jl. Tambak Medokan Ayu 3c No. 23, Surabaya'),
(2, 'Siti Nurhaliza', 'CV Berkah Mandiri', 'Jl. Pahlawan No. 10, Tangerang'),
(3, 'Budi Santoso', 'PT Maju Bersama', 'Jl. Kenanga No. 5, Jakarta Timur'),
(4, 'Dewi Lestari', 'Toko Obat Murah', 'Jl. Melati No. 12, Bekasi'),
(5, 'Ahmad Rizki', 'RS Harapan Kita', 'Jl. Raya Bogor No. 88, Depok');

-- --------------------------------------------------------

--
-- Table structure for table `detail_faktur`
--

CREATE TABLE `detail_faktur` (
  `id_detail` int(11) NOT NULL,
  `no_faktur` varchar(50) DEFAULT NULL,
  `id_produk` int(11) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `price` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detail_faktur`
--

INSERT INTO `detail_faktur` (`id_detail`, `no_faktur`, `id_produk`, `qty`, `price`) VALUES
(1, 'PJ2604150001', 1, 2, 1000.00),
(2, 'PJ2604150001', 2, 3, 2500.00),
(3, 'PJ2604150001', 3, 5, 12000.00),
(6, 'PJ2604150002', 4, 10, 5000.00),
(7, 'PJ2604150002', 5, 5, 3000.00);

-- --------------------------------------------------------

--
-- Table structure for table `faktur`
--

CREATE TABLE `faktur` (
  `no_faktur` varchar(50) NOT NULL,
  `tgl_faktur` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `metode_bayar` enum('Tunai','Kredit','Transfer') DEFAULT 'Tunai',
  `ppn` decimal(15,2) DEFAULT 0.00,
  `dp` decimal(15,2) DEFAULT 0.00,
  `grand_total` decimal(15,2) NOT NULL,
  `user` varchar(50) DEFAULT NULL,
  `id_customer` int(11) DEFAULT NULL,
  `id_perusahaan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faktur`
--

INSERT INTO `faktur` (`no_faktur`, `tgl_faktur`, `due_date`, `metode_bayar`, `ppn`, `dp`, `grand_total`, `user`, `id_customer`, `id_perusahaan`) VALUES
('PJ2604150001', '2026-04-15', '2026-04-30', 'Tunai', 6950.00, 0.00, 76450.00, 'admin', 1, 1),
('PJ2604150002', '2026-04-15', '2026-04-15', 'Transfer', 6500.00, 0.00, 71500.00, 'admin', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `perusahaan`
--

CREATE TABLE `perusahaan` (
  `id_perusahaan` int(11) NOT NULL,
  `nama_perusahaan` varchar(100) NOT NULL,
  `alamat` text DEFAULT NULL,
  `no_telp` varchar(20) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `perusahaan`
--

INSERT INTO `perusahaan` (`id_perusahaan`, `nama_perusahaan`, `alamat`, `no_telp`, `tax`) VALUES
(1, 'Apotek Sehat Selalu', 'Jl. Merdeka No. 1, Tangerang', '021-1234567', 10.00),
(2, 'Apotek Mulia Farma', 'Jl. Sudirman No. 15, Jakarta Selatan', '021-7654321', 10.00),
(3, 'Apotek Sumber Waras', 'Jl. Ahmad Yani No. 8, Bekasi', '021-8901234', 11.00),
(4, 'Apotek Medika Jaya', 'Jl. Gatot Subroto No. 22, Depok', '021-5678901', 10.00),
(5, 'Apotek Indo Farma', 'Jl. Diponegoro No. 5, Bogor', '0251-345678', 11.00),
(6, 'Apotek Kukuy Sehat Walafiat', 'Jl. Papanggo Raya', '089311313222232323', 2.00);

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id_produk` int(11) NOT NULL,
  `nama_produk` varchar(100) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `jenis` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id_produk`, `nama_produk`, `price`, `jenis`, `stock`) VALUES
(1, 'Bodrex Flu', 1000.00, 'Ampul', 98),
(2, 'Vitamin C 50 MG KF 10 Tablet', 2500.00, 'Strip', 197),
(3, 'Paracetamol Ekstra 20mg', 12000.00, 'Pcs', 145),
(4, 'Amoxicillin 500mg', 5000.00, 'Tablet', 70),
(5, 'Promag Tablet', 3000.00, 'Sachet', 115);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id_customer`);

--
-- Indexes for table `detail_faktur`
--
ALTER TABLE `detail_faktur`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `no_faktur` (`no_faktur`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indexes for table `faktur`
--
ALTER TABLE `faktur`
  ADD PRIMARY KEY (`no_faktur`),
  ADD KEY `id_customer` (`id_customer`),
  ADD KEY `id_perusahaan` (`id_perusahaan`);

--
-- Indexes for table `perusahaan`
--
ALTER TABLE `perusahaan`
  ADD PRIMARY KEY (`id_perusahaan`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id_customer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `detail_faktur`
--
ALTER TABLE `detail_faktur`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `perusahaan`
--
ALTER TABLE `perusahaan`
  MODIFY `id_perusahaan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_faktur`
--
ALTER TABLE `detail_faktur`
  ADD CONSTRAINT `detail_faktur_ibfk_1` FOREIGN KEY (`no_faktur`) REFERENCES `faktur` (`no_faktur`),
  ADD CONSTRAINT `detail_faktur_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Constraints for table `faktur`
--
ALTER TABLE `faktur`
  ADD CONSTRAINT `faktur_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customer` (`id_customer`),
  ADD CONSTRAINT `faktur_ibfk_2` FOREIGN KEY (`id_perusahaan`) REFERENCES `perusahaan` (`id_perusahaan`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
