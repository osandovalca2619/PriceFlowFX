-- Tabla de clientes
-- Almacena la información de los clientes de la plataforma FX
CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    client_identifier VARCHAR(50) UNIQUE NOT NULL,   -- Identificador interno propio
    name VARCHAR(100) NOT NULL,
    segment_id INTEGER NOT NULL REFERENCES segment(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    status VARCHAR(10) NOT NULL DEFAULT 'activo',
    created_by INTEGER NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER REFERENCES app_user(id) ON DELETE RESTRICT,
    modified_at TIMESTAMP,
    -- La inactivación se gestiona con el campo status y auditoría
    CONSTRAINT client_status_check CHECK (status IN ('activo', 'inactivo'))
);

-- Índices para búsqueda eficiente
CREATE INDEX idx_client_identifier ON client(client_identifier);
CREATE INDEX idx_client_segment_id ON client(segment_id);

COMMENT ON TABLE client IS 'Almacena la información de los clientes de la plataforma FX';
COMMENT ON COLUMN client.client_identifier IS 'Identificador interno propio del cliente';
COMMENT ON COLUMN client.segment_id IS 'Segmento de cliente (FK a segment)';
COMMENT ON COLUMN client.status IS 'Estado del cliente: activo o inactivo';
COMMENT ON COLUMN client.created_by IS 'Usuario que creó el registro';
COMMENT ON COLUMN client.modified_by IS 'Usuario que modificó el registro';
