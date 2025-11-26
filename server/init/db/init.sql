CREATE EXTENSION IF NOT EXISTS "pgcrypto";
DROP TABLE IF EXISTS "workout_exercise" CASCADE;
DROP TABLE IF EXISTS "workout" CASCADE;
DROP TABLE IF EXISTS "exercise" CASCADE;
DROP TABLE IF EXISTS "food" CASCADE;
DROP TABLE IF EXISTS "plans" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    weight_kg FLOAT NOT NULL,
    height_cm INT NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    birth_date DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    refresh_tokens TEXT[]
);
CREATE TABLE IF NOT EXISTS "exercise" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    muscle_group VARCHAR(50) NOT NULL,
    equipment VARCHAR(255),
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "workout" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INT NOT NULL,
    date DATE NOT NULL,
    user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "workout_exercise" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sets INT NOT NULL,
    reps INT NOT NULL,
    weight_kg NUMERIC,
    rest_seconds INT,
    workout_id UUID REFERENCES "workout"(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES "exercise"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "plans" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "food" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    protein NUMERIC NOT NULL,
    carbs NUMERIC NOT NULL,
    fats NUMERIC NOT NULL,
    user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO "user"(first_name, last_name, email, phone_number, password, weight_kg, height_cm, role)
VALUES
('Dimitar', 'Georgievski', 'dimitar@example.com', '071123456', 'password', 80, 180, 'user');
INSERT INTO "exercise"(name, muscle_group, description)
VALUES
('Bench Press', 'CHEST', 'Bench press description'),
('Squat', 'LEGS', 'Squat description');
INSERT INTO "workout"(title, description, duration_minutes, date, user_id)
SELECT 'Morning Workout', 'Chest and legs workout', 60, CURRENT_DATE, id FROM "user" LIMIT 1;
INSERT INTO "plans"(title, description, start_date, end_date, user_id)
SELECT 'Weight Loss Plan', 'Lose weight in 2 months', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', id FROM "user" LIMIT 1;
INSERT INTO "food"(name, calories, protein, carbs, fats, user_id)
SELECT 'Chicken Breast', 165, 31, 0, 3.6, id FROM "user" LIMIT 1;