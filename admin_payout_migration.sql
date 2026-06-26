-- Run these queries in your MySQL database

-- 1. Add bank detail columns to admin_users table
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS bank_name           VARCHAR(100)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(30)   DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bank_ifsc           VARCHAR(20)   DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bank_holder_name    VARCHAR(100)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS upi_id              VARCHAR(100)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS preferred_method    VARCHAR(10)   DEFAULT 'bank';

-- 2. Create admin_payouts table
CREATE TABLE IF NOT EXISTS admin_payouts (
  id            BIGINT(20)     NOT NULL AUTO_INCREMENT,
  admin_id      BIGINT(20)     NOT NULL,
  amount        DECIMAL(12,2)  NOT NULL,
  method        VARCHAR(20)    NOT NULL DEFAULT 'bank',
  note          TEXT           DEFAULT NULL,
  status        VARCHAR(20)    NOT NULL DEFAULT 'pending',
  requested_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_admin_id (admin_id)
);
