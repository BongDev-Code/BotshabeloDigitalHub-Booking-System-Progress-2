-- Extend users table for authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create reminders table for tracking recurring reminders
CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  reminder_type VARCHAR(50) NOT NULL, -- 'biweekly', 'final'
  scheduled_date DATE NOT NULL,
  sent_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for login management
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON reminders(scheduled_date, status);
CREATE INDEX IF NOT EXISTS idx_reminders_booking ON reminders(booking_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- Insert default receptionist user
INSERT INTO users (name, email, category, role, password_hash, is_active) 
VALUES (
  'Receptionist', 
  'receptionist@botshabelo.com', 
  'Staff', 
  'receptionist', 
  '$2b$10$example_hash_replace_with_real_hash', -- Replace with actual hash
  true
) ON CONFLICT (email) DO NOTHING;
