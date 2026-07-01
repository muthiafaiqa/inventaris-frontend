-- SQL Schema for Toko Surya Elektrik Inventaris
-- Run this in the Supabase SQL Editor

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for Authenticated Users (Admins)
CREATE POLICY "Allow authenticated users select on products" 
    ON products FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow authenticated users insert on products" 
    ON products FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users update on products" 
    ON products FOR UPDATE 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow authenticated users delete on products" 
    ON products FOR DELETE 
    TO authenticated 
    USING (true);

-- 4. Create Sales History Table
CREATE TABLE IF NOT EXISTS sales_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    bulan INTEGER CHECK (bulan >= 1 AND bulan <= 12) NOT NULL,
    tahun INTEGER NOT NULL,
    qty_sold INTEGER CHECK (qty_sold >= 0) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (product_id, bulan, tahun)
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE sales_history ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies for Authenticated Users (Admins)
CREATE POLICY "Allow authenticated users select on sales_history" 
    ON sales_history FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow authenticated users insert on sales_history" 
    ON sales_history FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users update on sales_history" 
    ON sales_history FOR UPDATE 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow authenticated users delete on sales_history" 
    ON sales_history FOR DELETE 
    TO authenticated 
    USING (true);

