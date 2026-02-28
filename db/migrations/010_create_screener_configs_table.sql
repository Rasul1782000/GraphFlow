CREATE TABLE IF NOT EXISTS screener_configs (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id    CHAR(36)     NOT NULL,
  name       VARCHAR(200) NOT NULL,
  filters    JSON         NOT NULL,
  columns    JSON         NOT NULL,
  sort_by    VARCHAR(100) DEFAULT 'market_cap',
  sort_dir   ENUM('ASC','DESC') DEFAULT 'DESC',
  is_public  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_screener_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user      (user_id),
  INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
