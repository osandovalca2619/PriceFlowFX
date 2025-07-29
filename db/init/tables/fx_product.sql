-- Tabla de productos FX
-- Catálogo de productos de Foreign Exchange (Spot, Forward, etc.)
CREATE TABLE fx_product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,               -- Ej: Spot, Forward
    description VARCHAR(100)
);

CREATE INDEX idx_fx_product_name ON fx_product(name);

COMMENT ON TABLE fx_product IS 'Catálogo de productos de Foreign Exchange (Spot, Forward, etc.)';
COMMENT ON COLUMN fx_product.name IS 'Nombre del producto FX (único)';
COMMENT ON COLUMN fx_product.description IS 'Descripción del producto FX';
