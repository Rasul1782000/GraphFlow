CREATE TABLE IF NOT EXISTS watchlists (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id    CHAR(36)     NOT NULL,
  name       VARCHAR(200) NOT NULL,
  is_default BOOLEAN      NOT NULL DEFAULT FALSE,
  color      VARCHAR(7)   DEFAULT '#6366f1',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_watchlist_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS watchlist_symbols (
  watchlist_id CHAR(36)  NOT NULL,
  symbol_id    INT       NOT NULL,
  sort_order   INT       NOT NULL DEFAULT 0,
  added_at     DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (watchlist_id, symbol_id),
  CONSTRAINT fk_ws_watchlist FOREIGN KEY (watchlist_id)
    REFERENCES watchlists(id) ON DELETE CASCADE,
  CONSTRAINT fk_ws_symbol FOREIGN KEY (symbol_id)
    REFERENCES symbols(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
