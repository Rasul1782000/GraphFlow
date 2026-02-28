INSERT INTO symbols (ticker, name, asset_class, exchange, currency, is_active, sector) VALUES
  ('AAPL',  'Apple Inc.',              'stock',  'NASDAQ', 'USD', TRUE, 'Technology'),
  ('MSFT',  'Microsoft Corporation',   'stock',  'NASDAQ', 'USD', TRUE, 'Technology'),
  ('GOOGL', 'Alphabet Inc.',           'stock',  'NASDAQ', 'USD', TRUE, 'Technology'),
  ('AMZN',  'Amazon.com Inc.',         'stock',  'NASDAQ', 'USD', TRUE, 'Consumer Cyclical'),
  ('NVDA',  'NVIDIA Corporation',      'stock',  'NASDAQ', 'USD', TRUE, 'Technology'),
  ('TSLA',  'Tesla Inc.',              'stock',  'NASDAQ', 'USD', TRUE, 'Automotive'),
  ('META',  'Meta Platforms Inc.',     'stock',  'NASDAQ', 'USD', TRUE, 'Technology'),
  ('BTCUSDT','Bitcoin / USDT',         'crypto', 'Binance','USD', TRUE, NULL),
  ('ETHUSDT','Ethereum / USDT',        'crypto', 'Binance','USD', TRUE, NULL),
  ('SOLUSDT','Solana / USDT',          'crypto', 'Binance','USD', TRUE, NULL),
  ('EURUSD', 'Euro / US Dollar',       'forex',  'FX',     'USD', TRUE, NULL),
  ('GBPUSD', 'British Pound / USD',    'forex',  'FX',     'USD', TRUE, NULL),
  ('SPY',   'SPDR S&P 500 ETF',        'etf',    'NYSE',   'USD', TRUE, 'Broad Market'),
  ('QQQ',   'Invesco QQQ Trust',       'etf',    'NASDAQ', 'USD', TRUE, 'Technology')
ON DUPLICATE KEY UPDATE is_active = TRUE;
