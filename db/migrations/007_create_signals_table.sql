CREATE TABLE IF NOT EXISTS signals (
  id           CHAR(36)       NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  symbol_id    INT            NOT NULL,
  source       VARCHAR(100)   NOT NULL,
  type         ENUM('buy','sell','neutral') NOT NULL,
  strength     TINYINT UNSIGNED NOT NULL DEFAULT 50,
  timeframe    ENUM('1m','5m','15m','30m','1h','4h','1d','1w') NOT NULL,
  entry_price  DECIMAL(20,8),
  stop_loss    DECIMAL(20,8),
  take_profit  DECIMAL(20,8),
  risk_reward  DECIMAL(5,2),
  description  TEXT,
  metadata     JSON,
  expires_at   DATETIME,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_signal_symbol FOREIGN KEY (symbol_id)
    REFERENCES symbols(id),
  INDEX idx_symbol_created (symbol_id, created_at),
  INDEX idx_type_strength  (type, strength),
  INDEX idx_expires        (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
