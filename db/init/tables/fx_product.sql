-- Tabla de productos FX
-- Catálogo de productos de Foreign Exchange (Spot, Forward, etc.)
CREATE TABLE IF NOT EXISTS fx_product (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    active BOOLEAN DEFAULT true
);



CREATE INDEX idx_fx_product_name ON fx_product(name);

COMMENT ON TABLE fx_product IS 'Catálogo de productos de Foreign Exchange (Spot, Forward, etc.)';
COMMENT ON COLUMN fx_product.name IS 'Nombre del producto FX (único)';
COMMENT ON COLUMN fx_product.description IS 'Descripción del producto FX';

INSERT INTO fx_product (code, name, description, active) VALUES 
('SPOT', 'Spot FX', 'Operaciones de cambio al contado', true),
('FORWARD', 'Forward FX', 'Operaciones de cambio a plazo', true)
ON CONFLICT (code) DO NOTHING;