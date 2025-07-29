-- Tabla de estados de operación FX
-- Catálogo de estados posibles para operaciones FX
CREATE TABLE fx_operation_status (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,      -- Ej: 'completa', 'pendiente'
    description VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL
);

CREATE INDEX idx_fx_operation_status_code ON fx_operation_status(code);

COMMENT ON TABLE fx_operation_status IS 'Catálogo de estados posibles para operaciones FX';
COMMENT ON COLUMN fx_operation_status.code IS 'Código del estado de la operación';
COMMENT ON COLUMN fx_operation_status.description IS 'Descripción del estado';
COMMENT ON COLUMN fx_operation_status.display_order IS 'Orden de visualización';

-- Ejemplo de inserts iniciales
INSERT INTO fx_operation_status (code, description, display_order) VALUES
('completa', 'Operación completada', 1),
('pendiente', 'Operación pendiente', 2),
('anulada', 'Operación anulada', 3),
('incompleta', 'Operación incompleta', 4),
('pendiente de aprobar', 'Pendiente de aprobación', 5),
('pendiente de anular', 'Pendiente de anulación', 6);
