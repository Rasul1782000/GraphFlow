CREATE TABLE IF NOT EXISTS trades (
  id           CHAR(36)       NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  position_id  CHAR(36)       NOT NULL,
  portfolio_id CHAR(36)       NOT NULL,
  symbol_id    INT            NOT NULL,
  type         ENUM('buy','sell','short','cover') NOT NULL,
  quantity     DECIMAL(20,8)  NOT NULL,
  price        DECIMAL(20,8)  NOT NULL,
  total        DECIMAL(20,8)  NOT NULL,
  fee          DECIMAL(20,8)  NOT NULL DEFAULT 0,
  notes        TEXT,
  signal_id    CHAR(36),
  executed_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trade_position  FOREIGN KEY (position_id)  REFERENCES positions(id),
  CONSTRAINT fk_trade_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolios(id),
  CONSTRAINT fk_trade_symbol    FOREIGN KEY (symbol_id)    REFERENCES symbols(id),
  INDEX idx_portfolio_date (portfolio_id, executed_at),
  INDEX idx_position       (position_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
