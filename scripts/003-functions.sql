-- Function to check booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_facility_id UUID,
  p_booking_date DATE,
  p_start_time TIME,
  p_end_time TIME,
  p_booking_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookings 
    WHERE facility_id = p_facility_id 
    AND booking_date = p_booking_date
    AND status = 'confirmed'
    AND (p_booking_id IS NULL OR id != p_booking_id)
    AND (
      (start_time <= p_start_time AND end_time > p_start_time) OR
      (start_time < p_end_time AND end_time >= p_end_time) OR
      (start_time >= p_start_time AND end_time <= p_end_time)
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get pricing for a booking
CREATE OR REPLACE FUNCTION get_booking_price(
  p_facility_id UUID,
  p_user_category VARCHAR(50)
) RETURNS DECIMAL(10,2) AS $$
DECLARE
  price DECIMAL(10,2);
BEGIN
  SELECT p.price INTO price
  FROM pricing p
  WHERE p.facility_id = p_facility_id 
  AND p.user_category = p_user_category;
  
  RETURN COALESCE(price, 0);
END;
$$ LANGUAGE plpgsql;
