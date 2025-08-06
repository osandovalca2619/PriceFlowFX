-- Tabla de origen de cotización (ej: web, mesa, app, etc.)
-- Catálogo de orígenes de cotización para operaciones FX
CREATE TABLE IF NOT EXISTS quote_origin (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT true
);

CREATE INDEX idx_quote_origin_name ON quote_origin(name);

COMMENT ON TABLE quote_origin IS 'Catálogo de orígenes de cotización para operaciones FX';
COMMENT ON COLUMN quote_origin.name IS 'Nombre único del origen de cotización';

INSERT INTO quote_origin (code, name, active) VALUES 
('BLOOMBERG', 'Bloomberg Terminal', true),
('REUTERS', 'Reuters', true),
('DATATEC', 'DataTec', true),
('WEB_EMPRESA', 'Web Empresa', true),
('SALES', 'Sales', true),
('WEALTH', 'Wealth Management', true),
('CORREDORA', 'Corredora de Bolsa', true),
('WEB_PERSONAS', 'Web Personas', true),
('APP_MOVIL', 'App Móvil', true),
('SUCURSALES', 'Sucursales', true)
ON CONFLICT (code) DO NOTHING;
