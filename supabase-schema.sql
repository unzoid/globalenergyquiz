-- Supabase SQL Schema for Unzoid Energy Challenge

-- Students table to store participant information
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  class TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table to store weekly energy-saving submissions
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  week_number INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answers JSONB NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_week_number ON submissions(week_number);
CREATE INDEX idx_students_class ON students(class);

-- Create Row Level Security (RLS) policies
-- Enable RLS on tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only)
CREATE POLICY "Allow public read access to students" 
  ON students FOR SELECT USING (true);

CREATE POLICY "Allow public read access to submissions" 
  ON submissions FOR SELECT USING (true);

-- Create policies for authenticated users (insert)
CREATE POLICY "Allow authenticated users to insert students" 
  ON students FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert submissions" 
  ON submissions FOR INSERT WITH CHECK (true);