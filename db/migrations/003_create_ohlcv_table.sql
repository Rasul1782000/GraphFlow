CREATE TABLE IF NOT EXISTS ohlcv (
  id         BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
  symbol_id  INT           NOT NULL,
  timeframe  ENUM('1m','5m','15m','30m','1h','4h','1d','1w') NOT NULL,
  open_time  DATETIME      NOT NULL,
  open       DECIMAL(20,8) NOT NULL,
  high       DECIMAL(20,8) NOT NULL,
  low        DECIMAL(20,8) NOT NULL,
  close      DECIMAL(20,8) NOT NULL,
  volume     DECIMAL(30,8) NOT NULL,
  close_time DATETIME      NOT NULL,
  UNIQUE KEY uq_symbol_tf_time (symbol_id, timeframe, open_time),
  INDEX idx_symbol_time (symbol_id, open_time),
  INDEX idx_timeframe   (timeframe),
  CONSTRAINT fk_ohlcv_symbol FOREIGN KEY (symbol_id)
    REFERENCES symbols(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (YEAR(open_time)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);
