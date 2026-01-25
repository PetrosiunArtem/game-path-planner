-- Database Schema for Game Path Planner

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS loadouts;
DROP TABLE IF EXISTS weapons;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS bosses;
DROP TABLE IF EXISTS levels;

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
    owned BOOLEAN DEFAULT false
);

-- Skills
CREATE TABLE skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER,
    max_level INTEGER
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
    status TEXT
);

-- Initial Data Seed
INSERT INTO weapons (id, name, type, damage, owned) VALUES
('1', 'Peashooter', 'Standard', 45, true),
('2', 'Spread', 'Short Range', 62, false),
('3', 'Chaser', 'Homing', 30, false),
('4', 'Lobber', 'Medium Range', 55, false),
('5', 'Charge', 'Charge Shot', 85, false),
('6', 'Roundabout', 'Long Range', 48, false);

INSERT INTO skills (id, name, level, max_level) VALUES
('1', 'Accuracy', 5, 10),
('2', 'Parry Skill', 3, 10),
('3', 'Survival', 7, 10),
('4', 'Movement', 4, 10),
('5', 'Pattern Recognition', 2, 10);

INSERT INTO bosses (id, name, defeated, difficulty) VALUES
('1', 'The Root Pack', true, 'Easy'),
('2', 'Goopy Le Grande', true, 'Easy'),
('3', 'Hilda Berg', false, 'Medium'),
('4', 'Cagney Carnation', false, 'Medium'),
('5', 'Baroness Von Bon Bon', false, 'Hard'),
('6', 'Grim Matchstick', false, 'Hard'),
('7', 'King Dice', false, 'Extreme'),
('8', 'The Devil', false, 'Extreme');

INSERT INTO levels (id, name, status) VALUES
('1', 'Forest Follies', 'completed'),
('2', 'Treetop Trouble', 'completed'),
('3', 'Funfair Fever', 'available'),
('4', 'Funhouse Frazzle', 'available'),
('5', 'Rugged Ridge', 'locked'),
('6', 'Perilous Piers', 'locked');

INSERT INTO loadouts (id, name, weapon_primary, weapon_secondary, charm, super_move) VALUES
('00000000-0000-0000-0000-000000000001', 'Standard Peashooter', 'Peashooter', 'Spread', 'Smoke Bomb', 'Energy Beam'),
('00000000-0000-0000-0000-000000000002', 'Isle I Speedrun', 'Peashooter', 'Roundabout', 'Smoke Bomb', 'Energy Beam'),
('00000000-0000-0000-0000-000000000003', 'Defensive Setup', 'Chaser', 'Spread', 'Coffee', 'Invincibility'),
('00000000-0000-0000-0000-000000000004', 'Isle II Tactical', 'Lobber', 'Charge', 'Smoke Bomb', 'Energy Beam'),
('00000000-0000-0000-0000-000000000005', 'Boss Buster', 'Charge', 'Spread', 'Smoke Bomb', 'Energy Beam'),
('00000000-0000-0000-0000-000000000006', 'Long Range Specialist', 'Roundabout', 'Chaser', 'Smoke Bomb', 'Energy Beam');
