-- Tabla de folders de operaciones
-- Almacena los folders de operaciones (trading/sales) para organización y trazabilidad
CREATE TABLE operation_folder (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,         -- Código del folder
    name VARCHAR(100) NOT NULL,               -- Nombre descriptivo
    folder_type VARCHAR(10) NOT NULL CHECK (folder_type IN ('trading', 'sales')),
    status VARCHAR(10) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
    created_by INTEGER NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER REFERENCES app_user(id) ON DELETE RESTRICT,
    modified_at TIMESTAMP
);

CREATE INDEX idx_operation_folder_code ON operation_folder(code);
CREATE INDEX idx_operation_folder_status ON operation_folder(status);
CREATE INDEX idx_operation_folder_folder_type ON operation_folder(folder_type);

COMMENT ON TABLE operation_folder IS 'Almacena los folders de operaciones (trading/sales) para organización y trazabilidad';
COMMENT ON COLUMN operation_folder.code IS 'Código único del folder';
COMMENT ON COLUMN operation_folder.folder_type IS 'Tipo de folder: trading o sales';
COMMENT ON COLUMN operation_folder.status IS 'Estado del folder: activo o inactivo';
COMMENT ON COLUMN operation_folder.created_by IS 'Usuario que creó el folder';
COMMENT ON COLUMN operation_folder.modified_by IS 'Usuario que modificó el folder';
