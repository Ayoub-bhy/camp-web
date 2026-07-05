-- NUT-144: first-party event log — source of truth for funnel KPIs.
-- Privacy §4: no IP, no UA, no cookies, no user data. Events only.
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT UNIQUE NOT NULL,       -- dedup key, shared with pixel sends (NUT-145 CAPI)
  event TEXT NOT NULL CHECK (event IN
    ('PageView','ViewContent','Lead','InitiateCheckout','CompleteRegistration','Purchase')),
  src TEXT,                            -- traffic source tag (?src=ig_ad1)
  page TEXT,
  value REAL,                          -- Purchase only
  currency TEXT CHECK (currency IN ('SAR','JOD') OR currency IS NULL),
  ts INTEGER NOT NULL                  -- epoch ms
);
CREATE INDEX IF NOT EXISTS idx_events_event_ts ON events (event, ts);
CREATE INDEX IF NOT EXISTS idx_events_src ON events (src);
