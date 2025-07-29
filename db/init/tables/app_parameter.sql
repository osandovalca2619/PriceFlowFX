-- Tabla de parámetros de la aplicación
-- Almacena parámetros configurables de la aplicación FX
CREATE TABLE app_parameter (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,           -- Código del parámetro
    description VARCHAR(200) NOT NULL,          -- Descripción del parámetro
    value_str1 VARCHAR(100),
    value_str2 VARCHAR(100),
    value_int1 INTEGER,
    value_int2 INTEGER,
    value_dec1 NUMERIC(18,6),
    value_dec2 NUMERIC(18,6),
    status VARCHAR(10) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
    created_by INTEGER NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER REFERENCES app_user(id) ON DELETE RESTRICT,
    modified_at TIMESTAMP
);

CREATE INDEX idx_app_parameter_code ON app_parameter(code);
CREATE INDEX idx_app_parameter_status ON app_parameter(status);

COMMENT ON TABLE app_parameter IS 'Almacena parámetros configurables de la aplicación FX';
COMMENT ON COLUMN app_parameter.code IS 'Código único del parámetro';
COMMENT ON COLUMN app_parameter.status IS 'Estado del parámetro: activo o inactivo';
COMMENT ON COLUMN app_parameter.created_by IS 'Usuario que creó el parámetro';
COMMENT ON COLUMN app_parameter.modified_by IS 'Usuario que modificó el parámetro';
