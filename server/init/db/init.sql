CREATE EXTENSION IF NOT EXISTS "pgcrypto";
DROP TABLE IF EXISTS "trainer_switch_request" CASCADE;
DROP TABLE IF EXISTS "workout_exercises" CASCADE;
DROP TABLE IF EXISTS "workout" CASCADE;
DROP TABLE IF EXISTS "plans" CASCADE;
DROP TABLE IF EXISTS "food" CASCADE;
DROP TABLE IF EXISTS "exercise" CASCADE;
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
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    birth_date DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    refresh_tokens TEXT[] NOT NULL DEFAULT '{}',
    trainer_id UUID REFERENCES "user"(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "exercise" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    muscle_group VARCHAR(50) NOT NULL CHECK (muscle_group IN ('chest', 'back', 'shoulders', 'arms', 'legs', 'gluteus', 'abs')),
    equipment VARCHAR(255),
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES "user"(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "workout" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INT NOT NULL,
    date DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "workout_exercises" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sets INT NOT NULL,
    reps INT NOT NULL,
    weight_kg NUMERIC,
    rest_seconds INT,
    workout_id UUID NOT NULL REFERENCES "workout"(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES "exercise"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "plans" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
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
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "trainer_switch_request" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    requested_trainer_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    requested_by_role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    decided_at TIMESTAMP,
    decided_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_exercises_created_by
    ON "exercise"(created_by);
CREATE INDEX IF NOT EXISTS idx_user_trainer_id
    ON "user"(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_switch_request_user_id
    ON "trainer_switch_request"(user_id);
CREATE INDEX IF NOT EXISTS idx_trainer_switch_request_requested_trainer_id
    ON "trainer_switch_request"(requested_trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_switch_request_decided_by
    ON "trainer_switch_request"(decided_by);
INSERT INTO "user"(first_name, last_name, email, phone_number, password, weight_kg, height_cm, role)
VALUES
('Dimitar', 'Georgievski', 'dimitar@example.com', '071123456', '$2b$08$s5zTOtBbLaQy3GgFWhlRze4XPVbaVrNxH63ffFcinc/NbMxSrcBty', 80, 180, 'USER');
INSERT INTO "user"(first_name, last_name, email, phone_number, password, weight_kg, height_cm, role)
VALUES
('Dimitar1', 'Georgievski', 'dimitar1@example.com', '071123455', '$2b$08$s5zTOtBbLaQy3GgFWhlRze4XPVbaVrNxH63ffFcinc/NbMxSrcBty', 80, 180, 'TRAINER');
INSERT INTO "exercise"(name, muscle_group, description)
VALUES
('Bench Press', 'chest', 'Bench press description'),
('Squat', 'legs', 'Squat description');
INSERT INTO "workout"(title, description, duration_minutes, date, user_id)
SELECT 'Morning Workout', 'Chest and legs workout', 60, CURRENT_DATE, id FROM "user" LIMIT 1;
INSERT INTO "plans"(title, description, start_date, end_date, user_id)
SELECT 'Weight Loss Plan', 'Lose weight in 2 months', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', id FROM "user" LIMIT 1;
INSERT INTO "food"(name, calories, protein, carbs, fats, user_id)
SELECT 'Chicken Breast', 165, 31, 0, 3.6, id FROM "user" LIMIT 1;