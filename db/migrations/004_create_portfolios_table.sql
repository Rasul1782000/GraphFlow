CREATE TABLE IF NOT EXISTS portfolios (
  id           CHAR(36)      NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id      CHAR(36)      NOT NULL,
  name         VARCHAR(200)  NOT NULL,
  description  TEXT,
  currency     VARCHAR(10)   NOT NULL DEFAULT 'USD',
  initial_cash DECIMAL(20,2) NOT NULL DEFAULT 100000.00,
  current_cash DECIMAL(20,2) NOT NULL DEFAULT 100000.00,
  is_default   BOOLEAN       NOT NULL DEFAULT FALSE,
  is_paper     BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_portfolio_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user       (user_id),
  INDEX idx_is_default (user_id, is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
