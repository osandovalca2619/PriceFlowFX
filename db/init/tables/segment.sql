-- Tabla de segmentos (ej: retail, corporate, etc.)
-- Catálogo de segmentos de clientes para clasificación comercial
CREATE TABLE segment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE INDEX idx_segment_name ON segment(name);

COMMENT ON TABLE segment IS 'Catálogo de segmentos de clientes para clasificación comercial';
COMMENT ON COLUMN segment.name IS 'Nombre único del segmento de cliente';
