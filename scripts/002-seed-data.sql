-- Insert facilities
INSERT INTO facilities (name, type, capacity, hourly_rate) VALUES
('Office', 'office', 4, false),
('Hot-Desk-Day', 'workspace', 1, false),
('Hot-Desk-Month', 'workspace', 1, false),
('Board Room', 'meeting', 12, true),
('Meeting Room', 'meeting', 8, true),
('Auditorium', 'event', 100, true),
('PC Labs', 'lab', 20, true),
('Makerspace', 'lab', 15, true);

-- Insert pricing for all categories and facilities
INSERT INTO pricing (facility_id, user_category, price, unit) 
SELECT 
  f.id,
  category,
  CASE 
    WHEN f.name = 'Office' AND category = 'Corporates' THEN 8000
    WHEN f.name = 'Office' AND category = 'Industrialists' THEN 7000
    WHEN f.name = 'Office' AND category = 'Government' THEN 6000
    WHEN f.name = 'Office' AND category = 'Academia' THEN 4000
    WHEN f.name = 'Office' AND category = 'NGOs/CBOs' THEN 3000
    WHEN f.name = 'Office' AND category = 'General SMMEs' THEN 2500
    WHEN f.name = 'Office' AND category = 'Incubated SMMEs' THEN 1500
    
    WHEN f.name = 'Board Room' AND category = 'Corporates' THEN 70
    WHEN f.name = 'Board Room' AND category = 'Industrialists' THEN 60
    WHEN f.name = 'Board Room' AND category = 'Government' THEN 50
    WHEN f.name = 'Board Room' AND category = 'Academia' THEN 40
    WHEN f.name = 'Board Room' AND category = 'NGOs/CBOs' THEN 30
    WHEN f.name = 'Board Room' AND category = 'General SMMEs' THEN 30
    WHEN f.name = 'Board Room' AND category = 'Incubated SMMEs' THEN 0
    
    -- Add more pricing rules as needed
    ELSE 0
  END as price,
  CASE 
    WHEN f.name = 'Office' THEN 'month'
    WHEN f.name LIKE '%Month%' THEN 'month'
    WHEN f.name LIKE '%Day%' THEN 'day'
    ELSE 'hour'
  END as unit
FROM facilities f
CROSS JOIN (VALUES 
  ('Corporates'), ('Industrialists'), ('Government'), 
  ('Academia'), ('NGOs/CBOs'), ('General SMMEs'), ('Incubated SMMEs')
) AS categories(category)
WHERE f.name IN ('Office', 'Board Room'); -- Add more facilities as needed
