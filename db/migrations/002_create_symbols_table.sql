CREATE TABLE IF NOT EXISTS symbols (
  id          INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ticker      VARCHAR(20)   NOT NULL UNIQUE,
  name        VARCHAR(200)  NOT NULL,
  asset_class ENUM('stock','crypto','forex','futures','etf') NOT NULL,
  exchange    VARCHAR(50),
  currency    VARCHAR(10)   NOT NULL DEFAULT 'USD',
  is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
  market_cap  DECIMAL(20,2),
  sector      VARCHAR(100),
  description TEXT,
  logo_url    TEXT,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ticker      (ticker),
  INDEX idx_asset_class (asset_class),
  INDEX idx_active      (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
