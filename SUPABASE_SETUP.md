# Supabase Setup for Unzoid Energy Challenge

## Overview
This document provides instructions on how to set up Supabase for the Unzoid Energy Challenge application. The application uses Supabase as its backend database to store student information, energy-saving submissions, and calculate leaderboard rankings.

## Prerequisites
- A Supabase account (sign up at [supabase.com](https://supabase.com) if you don't have one)
- Your Supabase project URL and anon key

## Setup Steps

### 1. Create a New Supabase Project
1. Log in to your Supabase account
2. Click "New Project"
3. Enter a name for your project (e.g., "unzoid-energy-challenge")
4. Set a secure database password
5. Choose a region closest to your users
6. Click "Create new project"

### 2. Set Up Database Tables
1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the contents of the `supabase-schema.sql` file in this project
3. Paste the SQL into the SQL Editor and run the query
4. This will create the necessary tables with proper relationships and security policies

### 3. Configure Environment Variables
1. In your Supabase project dashboard, go to Project Settings > API
2. Copy the "Project URL" and "anon public" key
3. Open the `.env.local` file in this project
4. Replace the placeholder values with your actual Supabase URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 4. Test the Connection
After setting up your environment variables:
1. Run the application locally with `npm run dev`
2. Navigate to the submission page and create a test submission
3. Check your Supabase dashboard to verify that the data was correctly inserted into the tables

## Database Schema

### Students Table
Stores information about student participants:
- `id`: Unique identifier for the student
- `name`: Student's name (or "Anonymous" if they chose to be anonymous)
- `email`: Student's email address
- `class`: Student's class (TTO2 or TTO3)
- `points`: Total points accumulated across all submissions
- `created_at`: Timestamp when the student record was created

### Submissions Table
Stores weekly energy-saving submissions:
- `id`: Unique identifier for the submission
- `student_id`: Reference to the student who made the submission
- `week_number`: The week number of the challenge (1-4)
- `total_points`: Total points earned in this submission
- `is_anonymous`: Whether the submission should be displayed anonymously
- `created_at`: Timestamp when the submission was created
- `answers`: JSON object containing the student's answers to the questions

## Security Considerations
- The Supabase schema includes Row Level Security (RLS) policies that allow public read access but restrict write access to authenticated users
- The anon key should never be exposed in client-side code outside of environment variables
- For a production environment, consider implementing additional authentication mechanisms

## Troubleshooting
- If you encounter connection issues, verify that your environment variables are correctly set
- Check the Supabase dashboard for any error logs
- Ensure that your database schema matches the expected structure in the application