CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)      NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  username      VARCHAR(100)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  full_name     VARCHAR(200),
  avatar_url    TEXT,
  role          ENUM('user','admin','pro') NOT NULL DEFAULT 'user',
  is_verified   BOOLEAN       NOT NULL DEFAULT FALSE,
  refresh_token TEXT,
  last_login_at DATETIME,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email    (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
