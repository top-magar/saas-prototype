-- Add user preference columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS timezone VARCHAR(64) DEFAULT 'Asia/Kathmandu',
ADD COLUMN IF NOT EXISTS currency_code VARCHAR(3) DEFAULT 'NPR';

-- Add comments for documentation
COMMENT ON COLUMN users.language IS 'ISO 639-1 language code (e.g., en, ne, ja)';
COMMENT ON COLUMN users.timezone IS 'IANA timezone identifier (e.g., Asia/Kathmandu)';
COMMENT ON COLUMN users.currency_code IS 'ISO 4217 currency code (e.g., NPR, USD)';
