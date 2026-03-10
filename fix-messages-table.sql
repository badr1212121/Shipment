-- Fix messages table: remove old rows that don't have receiver_id
-- Run this in MySQL Workbench (connect to 'shipment' database) before starting the app

USE shipment;

-- Option 1: Delete all old messages (simplest)
DELETE FROM messages;

-- Option 2: If you want to keep data, set receiver to first admin (uncomment if needed):
-- UPDATE messages SET receiver_id = (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1) WHERE receiver_id IS NULL;
