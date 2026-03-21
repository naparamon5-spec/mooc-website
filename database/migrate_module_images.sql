-- Migration: Add legacy image URLs to modules
-- This script updates modules with image_url based on their ID/number mapping

-- Update modules to use legacy asset paths if image_url is NULL
UPDATE modules
SET image_url = '/assets/one.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 1%';

UPDATE modules
SET image_url = '/assets/two.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 2%';

UPDATE modules
SET image_url = '/assets/three.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 3%';

UPDATE modules
SET image_url = '/assets/four.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 4%';

UPDATE modules
SET image_url = '/assets/five.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 5%';

UPDATE modules
SET image_url = '/assets/six.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 6%';

UPDATE modules
SET image_url = '/assets/seven.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 7%';

UPDATE modules
SET image_url = '/assets/eight.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 8%';

UPDATE modules
SET image_url = '/assets/nine.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 9%';

UPDATE modules
SET image_url = '/assets/ten.png'
WHERE image_url IS NULL AND title LIKE '%MODULE 10%';

-- Verify the updates
SELECT id, title, image_url FROM modules ORDER BY created_at;
