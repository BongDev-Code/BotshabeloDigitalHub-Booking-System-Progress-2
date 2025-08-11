-- Function to create recurring reminders for a booking
CREATE OR REPLACE FUNCTION create_recurring_reminders(
  p_booking_id UUID,
  p_booking_date DATE
) RETURNS VOID AS $$
DECLARE
  reminder_date DATE;
  weeks_until_event INTEGER;
BEGIN
  -- Calculate weeks until the event
  weeks_until_event := EXTRACT(DAYS FROM (p_booking_date - CURRENT_DATE)) / 7;
  
  -- Only create biweekly reminders if event is more than 4 weeks away
  IF weeks_until_event > 4 THEN
    -- Create reminders every 2 weeks starting from 2 weeks from now
    reminder_date := CURRENT_DATE + INTERVAL '2 weeks';
    
    WHILE reminder_date < p_booking_date - INTERVAL '1 week' LOOP
      INSERT INTO reminders (booking_id, reminder_type, scheduled_date, message)
      VALUES (
        p_booking_id,
        'biweekly',
        reminder_date,
        'Biweekly reminder: Upcoming event in ' || 
        EXTRACT(DAYS FROM (p_booking_date - reminder_date)) || ' days'
      );
      
      reminder_date := reminder_date + INTERVAL '2 weeks';
    END LOOP;
  END IF;
  
  -- Always create a final reminder 1 day before
  INSERT INTO reminders (booking_id, reminder_type, scheduled_date, message)
  VALUES (
    p_booking_id,
    'final',
    p_booking_date - INTERVAL '1 day',
    'Final reminder: Event is tomorrow!'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get pending reminders for today
CREATE OR REPLACE FUNCTION get_pending_reminders()
RETURNS TABLE (
  reminder_id UUID,
  booking_id UUID,
  event_title VARCHAR(255),
  booking_date DATE,
  start_time TIME,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  facility_name VARCHAR(255),
  reminder_message TEXT,
  days_until_event INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    b.id,
    b.event_title,
    b.booking_date,
    b.start_time,
    u.name,
    u.email,
    f.name,
    r.message,
    EXTRACT(DAYS FROM (b.booking_date - CURRENT_DATE))::INTEGER
  FROM reminders r
  JOIN bookings b ON r.booking_id = b.id
  JOIN users u ON b.user_id = u.id
  JOIN facilities f ON b.facility_id = f.id
  WHERE r.scheduled_date <= CURRENT_DATE
    AND r.status = 'pending'
    AND b.status = 'confirmed'
  ORDER BY b.booking_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to mark reminder as sent
CREATE OR REPLACE FUNCTION mark_reminder_sent(p_reminder_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE reminders 
  SET status = 'sent', sent_date = NOW()
  WHERE id = p_reminder_id;
END;
$$ LANGUAGE plpgsql;
