-- Tabla de identificadores externos de cliente
-- Relaciona clientes internos con sus identificadores en sistemas externos
CREATE TABLE client_external_id (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES client(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    origin_system VARCHAR(30) NOT NULL,     -- Ej: 'bloomberg', 'reuters', 'datatec'
    origin_code VARCHAR(50) NOT NULL,       -- Código recibido del sistema externo
    UNIQUE (client_id, origin_system)
);

CREATE INDEX idx_client_external_id_client_id ON client_external_id(client_id);
CREATE INDEX idx_client_external_id_origin_system ON client_external_id(origin_system);

COMMENT ON TABLE client_external_id IS 'Relaciona clientes internos con sus identificadores en sistemas externos';
COMMENT ON COLUMN client_external_id.client_id IS 'Cliente interno (FK a client)';
COMMENT ON COLUMN client_external_id.origin_system IS 'Sistema externo de origen';
COMMENT ON COLUMN client_external_id.origin_code IS 'Código recibido del sistema externo';
