-- Tabla de origen de cotización (ej: web, mesa, app, etc.)
-- Catálogo de orígenes de cotización para operaciones FX
CREATE TABLE quote_origin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE INDEX idx_quote_origin_name ON quote_origin(name);

COMMENT ON TABLE quote_origin IS 'Catálogo de orígenes de cotización para operaciones FX';
COMMENT ON COLUMN quote_origin.name IS 'Nombre único del origen de cotización';
