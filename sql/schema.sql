-- Sparkio Database Schema
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS sparkio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sparkio;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('member', 'admin') NOT NULL DEFAULT 'member',
  referral_code VARCHAR(20) NOT NULL,
  referred_by INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_username UNIQUE (username),
  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT uq_users_referral_code UNIQUE (referral_code),
  CONSTRAINT fk_users_referred_by FOREIGN KEY (referred_by)
    REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_users_referral_code ON users (referral_code);

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  referrer_id INT UNSIGNED NULL,
  referred_user_id INT UNSIGNED NOT NULL,
  status ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_referrals_referrer FOREIGN KEY (referrer_id)
    REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_referrals_referred_user FOREIGN KEY (referred_user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_referrals_status ON referrals (status);
CREATE INDEX idx_referrals_referrer ON referrals (referrer_id);

-- Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  last_updated TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_wallets_user UNIQUE (user_id),
  CONSTRAINT fk_wallets_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Withdrawals Table
CREATE TABLE IF NOT EXISTS withdrawals (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processed', 'failed') NOT NULL DEFAULT 'pending',
  upi_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_withdrawals_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_withdrawals_status ON withdrawals (status);

-- Ads Table
CREATE TABLE IF NOT EXISTS ads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ad_placement_id VARCHAR(100) NOT NULL,
  ad_code_snippet TEXT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT uq_ads_placement UNIQUE (ad_placement_id)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

