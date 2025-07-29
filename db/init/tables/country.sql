-- Tabla de países
-- Catálogo de países según ISO 3166-1 alpha-2/alpha-3
CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL CHECK (char_length(code) IN (2,3) AND code = upper(code)),      -- Ej: 'CL', 'US', 'USA'
    name VARCHAR(100) NOT NULL
);

CREATE INDEX idx_country_name ON country(name);

COMMENT ON TABLE country IS 'Catálogo de países según ISO 3166-1 alpha-2/alpha-3';
COMMENT ON COLUMN country.code IS 'Código de país (2 o 3 letras mayúsculas, ISO 3166)';
COMMENT ON COLUMN country.name IS 'Nombre del país';
