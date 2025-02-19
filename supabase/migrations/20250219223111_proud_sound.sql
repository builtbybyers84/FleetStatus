/*
  # Initial Schema Setup for Police Fleet Management

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `email` (text)
      - `full_name` (text)
      - `role` (text) - either 'admin' or 'user'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `vehicles`
      - `id` (uuid, primary key)
      - `number` (text) - vehicle number
      - `status` (text)
      - `location` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid) - references profiles.id
    
    - `status_options`
      - `id` (uuid, primary key)
      - `name` (text)
      - `requires_work_order` (boolean)
      - `created_at` (timestamp)
    
    - `location_options`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `work_orders`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid) - references vehicles.id
      - `description` (text)
      - `status` (text) - 'open' or 'completed'
      - `created_by` (uuid) - references profiles.id
      - `completed_by` (uuid) - references profiles.id
      - `created_at` (timestamp)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add specific policies for admin users
*/

-- Create tables
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE status_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  requires_work_order boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE location_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  status uuid REFERENCES status_options(id),
  location uuid REFERENCES location_options(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

CREATE TABLE work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id),
  description text NOT NULL,
  status text CHECK (status IN ('open', 'completed')),
  created_by uuid REFERENCES profiles(id),
  completed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT work_orders_completed_status_check 
    CHECK (
      (status = 'completed' AND completed_at IS NOT NULL AND completed_by IS NOT NULL) OR
      (status = 'open' AND completed_at IS NULL AND completed_by IS NULL)
    )
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Vehicles policies
CREATE POLICY "Users can view all vehicles"
  ON vehicles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Only admins can create vehicles"
  ON vehicles FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update vehicles"
  ON vehicles FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Status options policies
CREATE POLICY "Users can view status options"
  ON status_options FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify status options"
  ON status_options FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Location options policies
CREATE POLICY "Users can view location options"
  ON location_options FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify location options"
  ON location_options FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Work orders policies
CREATE POLICY "Users can view all work orders"
  ON work_orders FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create work orders"
  ON work_orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Only admins can update work orders"
  ON work_orders FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Insert initial status options
INSERT INTO status_options (name, requires_work_order) VALUES
  ('Available', false),
  ('In Use', false),
  ('Out of Service', true);

-- Insert initial location options
INSERT INTO location_options (name) VALUES
  ('Police HQ'),
  ('Maintenance Shop'),
  ('District 1'),
  ('District 2'),
  ('District 3');
