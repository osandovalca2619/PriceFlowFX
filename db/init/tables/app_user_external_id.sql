-- Tabla de identificadores externos de usuario
-- Relaciona usuarios internos con sus identificadores en sistemas externos
CREATE TABLE app_user_external_id (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    origin_system VARCHAR(30) NOT NULL,     -- Ej: 'bloomberg', 'reuters', 'datatec'
    origin_code VARCHAR(50) NOT NULL,       -- Código recibido del sistema externo
    client_id INTEGER REFERENCES client(id) ON DELETE SET NULL ON UPDATE CASCADE, -- Relación con cliente si aplica
    UNIQUE (user_id, origin_system)
);

CREATE INDEX idx_app_user_external_id_user_id ON app_user_external_id(user_id);
CREATE INDEX idx_app_user_external_id_origin_system ON app_user_external_id(origin_system);
CREATE INDEX idx_app_user_external_id_client_id ON app_user_external_id(client_id);

COMMENT ON TABLE app_user_external_id IS 'Relaciona usuarios internos con sus identificadores en sistemas externos';
COMMENT ON COLUMN app_user_external_id.user_id IS 'Usuario interno (FK a app_user)';
COMMENT ON COLUMN app_user_external_id.origin_system IS 'Sistema externo de origen';
COMMENT ON COLUMN app_user_external_id.origin_code IS 'Código recibido del sistema externo';
COMMENT ON COLUMN app_user_external_id.client_id IS 'Cliente relacionado si aplica (FK a client)';
