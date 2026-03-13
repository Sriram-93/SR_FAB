-- Sample category wiring for shirt-like local images + 3D model metadata
-- Category chosen: Cotton Shirts (cid = 2)
-- Run this after the main catalog seed (new_catalog.sql).

USE `srfab`;

SET @shirt_pid_1 := (
  SELECT pid FROM product WHERE cid = 2 ORDER BY pid ASC LIMIT 1
);

SET @shirt_pid_2 := (
  SELECT pid FROM product WHERE cid = 2 ORDER BY pid ASC LIMIT 1 OFFSET 1
);

-- Assign the generated local shirt-style images.
UPDATE product
SET image = '/images/sample-cotton-shirts/cotton-shirt-01.svg'
WHERE pid = @shirt_pid_1;

UPDATE product
SET image = '/images/sample-cotton-shirts/cotton-shirt-02.svg'
WHERE pid = @shirt_pid_2;

-- Attach a ready 3D model to the first Cotton Shirt so the viewer opens instantly.
INSERT INTO model_3d (
  pid,
  model_url,
  model_format,
  provider,
  generation_status,
  created_at,
  updated_at,
  error_message
)
VALUES (
  @shirt_pid_1,
  '/models/shirt.glb',
  'glb',
  'local-demo',
  'ready',
  NOW(),
  NOW(),
  NULL
)
ON DUPLICATE KEY UPDATE
  model_url = VALUES(model_url),
  model_format = VALUES(model_format),
  provider = VALUES(provider),
  generation_status = VALUES(generation_status),
  updated_at = NOW(),
  error_message = NULL;
