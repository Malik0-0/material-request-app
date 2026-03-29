CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  request_date DATE NOT NULL,
  requester_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS material_details (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL,
  material_description TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  price NUMERIC,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_material_request
    FOREIGN KEY (request_id)
    REFERENCES requests(id)
    ON DELETE CASCADE
);
