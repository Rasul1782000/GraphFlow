CREATE TABLE IF NOT EXISTS positions (
  id               CHAR(36)       NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  portfolio_id     CHAR(36)       NOT NULL,
  symbol_id        INT            NOT NULL,
  side             ENUM('long','short') NOT NULL DEFAULT 'long',
  quantity         DECIMAL(20,8)  NOT NULL,
  avg_entry_price  DECIMAL(20,8)  NOT NULL,
  current_price    DECIMAL(20,8),
  stop_loss        DECIMAL(20,8),
  take_profit      DECIMAL(20,8),
  realized_pnl     DECIMAL(20,8)  NOT NULL DEFAULT 0,
  unrealized_pnl   DECIMAL(20,8)  NOT NULL DEFAULT 0,
  status           ENUM('open','closed','liquidated') NOT NULL DEFAULT 'open',
  opened_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at        DATETIME,
  CONSTRAINT fk_position_portfolio FOREIGN KEY (portfolio_id)
    REFERENCES portfolios(id) ON DELETE CASCADE,
  CONSTRAINT fk_position_symbol FOREIGN KEY (symbol_id)
    REFERENCES symbols(id),
  INDEX idx_portfolio_status (portfolio_id, status),
  INDEX idx_symbol           (symbol_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
