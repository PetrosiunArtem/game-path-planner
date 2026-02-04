-- Database Schema for Game Path Planner

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS loadouts;
DROP TABLE IF EXISTS weapons;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS bosses;
DROP TABLE IF EXISTS levels;
DROP TABLE IF EXISTS logs;

-- Loadouts
CREATE TABLE loadouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    weapon_primary TEXT,
    weapon_secondary TEXT,
    charm TEXT,
    super_move TEXT
);

-- Weapons
CREATE TABLE weapons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    damage INTEGER,
    owned BOOLEAN DEFAULT false,
    cost INTEGER DEFAULT 4
);

-- Skills
CREATE TABLE skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER,
    max_level INTEGER,
    cost INTEGER DEFAULT 1
);

-- Bosses
CREATE TABLE bosses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    defeated BOOLEAN DEFAULT false,
    difficulty TEXT
);

-- Levels
CREATE TABLE levels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT,
    coins_collected INTEGER DEFAULT 0,
    total_coins INTEGER DEFAULT 5
);

-- Operational Logs
CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT false
);

-- Initial Data Seed
INSERT INTO weapons (id, name, type, damage, owned, cost) VALUES
('1', 'Peashooter', 'Standard', 30, true, 0),
('2', 'Spread', 'Short Range', 41, false, 4),
('3', 'Chaser', 'Homing', 16, false, 4),
('4', 'Lobber', 'Medium Range', 33, false, 4),
('5', 'Charge', 'Charge Shot', 39, false, 4),
('6', 'Roundabout', 'Long Range', 32, false, 4),
('7', 'Crackshot', 'DLC / Homing', 29, false, 5),
('8', 'Converge', 'DLC / Wide', 32, false, 5),
('9', 'Twist-Up', 'DLC / Curved', 34, false, 5);

INSERT INTO skills (id, name, level, max_level, cost) VALUES
('1', 'Accuracy', 5, 10, 1),
('2', 'Parry Skill', 3, 10, 1),
('3', 'Survival', 7, 10, 1),
('4', 'Movement', 4, 10, 1),
('5', 'Pattern Recognition', 2, 10, 1);

INSERT INTO bosses (id, name, defeated, difficulty) VALUES
('1', 'The Root Pack', true, 'Easy'),
('2', 'Goopy Le Grande', true, 'Easy'),
('3', 'Hilda Berg', false, 'Medium'),
('4', 'Cagney Carnation', false, 'Medium'),
('5', 'Baroness Von Bon Bon', false, 'Hard'),
('6', 'Grim Matchstick', false, 'Hard'),
('7', 'King Dice', false, 'Extreme'),
('8', 'The Devil', false, 'Extreme');

INSERT INTO levels (id, name, status, coins_collected, total_coins) VALUES
('1', 'Forest Follies', 'completed', 5, 5),
('2', 'Treetop Trouble', 'completed', 3, 5),
('3', 'Funfair Fever', 'available', 0, 5),
('4', 'Funhouse Frazzle', 'available', 0, 5),
('5', 'Rugged Ridge', 'locked', 0, 5),
('6', 'Perilous Piers', 'locked', 0, 5);

INSERT INTO logs (type, title, description, date, completed) VALUES
('level', 'Completed "Forest Follies" Run & Gun', 'Collected all 5 gold coins', '2025-12-01', true),
('weapon', 'Purchased Spread Shot', 'Acquired from Porkrind''s Emporium', '2025-11-28', true),
('boss', 'Defeated The Root Pack', 'Knockout! A Brawl is surely brewing!', '2025-11-25', true),
('level', 'Unlock Inkwell Isle II', 'Defeat all bosses in Isle I to proceed', '2025-12-02', false);

INSERT INTO loadouts (id, name, weapon_primary, weapon_secondary, charm, super_move) VALUES
('00000000-0000-0000-0000-000000000001', 'Standard Peashooter', 'Peashooter', 'Spread', 'Smoke Bomb', 'Energy Beam'),
('00000000-0000-0000-0000-000000000002', 'Isle I Speedrun', 'Peashooter', 'Roundabout', 'Smoke Bomb', 'Energy Beam'),
('00000000-0000-0000-0000-000000000003', 'Defensive Setup', 'Chaser', 'Spread', 'Coffee', 'Invincibility'),
('00000000-0000-0000-0000-000000000004', 'Isle II Tactical', 'Lobber', 'Charge', 'Smoke Bomb', 'Energy Beam'),
('00000000-0000-0000-0000-000000000005', 'Boss Buster', 'Charge', 'Spread', 'Smoke Bomb', 'Energy Beam'),
('00000000-0000-0000-0000-000000000006', 'Long Range Specialist', 'Roundabout', 'Chaser', 'Smoke Bomb', 'Energy Beam');
