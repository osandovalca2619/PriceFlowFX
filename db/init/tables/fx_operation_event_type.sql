
CREATE TABLE fx_operation_event_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,        -- 'created', 'modified', 'cancelled', 'approved'
    description VARCHAR(100) NOT NULL,
    applies_to VARCHAR(20) NOT NULL CHECK (applies_to IN ('spot', 'forward', 'both')),
    is_system_event BOOLEAN DEFAULT FALSE    -- Distingue eventos del sistema vs usuario
);

INSERT INTO fx_operation_event_type (code, description, applies_to) VALUES
('created', 'Operación creada', 'both'),
('modified', 'Operación modificada', 'both'),
('cancelled', 'Operación cancelada', 'both'),
('approved', 'Operación aprobada', 'both'),
('settled', 'Operación liquidada', 'both'),
('expired', 'Operación vencida', 'forward');