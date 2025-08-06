-- Tabla de segmentos (ej: retail, corporate, etc.)
-- Catálogo de segmentos de clientes para clasificación comercial
CREATE TABLE IF NOT EXISTS segment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(100)
);

CREATE INDEX idx_segment_name ON segment(name);

COMMENT ON TABLE segment IS 'Catálogo de segmentos de clientes para clasificación comercial';
COMMENT ON COLUMN segment.name IS 'Nombre único del segmento de cliente';

INSERT INTO segment (name, description) VALUES 
('Premium', 'Clientes premium con beneficios especiales'),
('Corporate', 'Clientes corporativos'),
('Retail', 'Clientes minoristas'),
('Private', 'Banca privada')
ON CONFLICT (name) DO NOTHING;