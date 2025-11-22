-- Add email verification columns to users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR,
  ADD COLUMN IF NOT EXISTS email_verification_token_expires_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_token 
  ON users(email_verification_token) 
  WHERE email_verification_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_email_verified 
  ON users(email_verified);

-- Set existing users as verified (grandfather clause)
UPDATE users SET email_verified = TRUE WHERE email_verified IS NULL;
