-- Tabla de transiciones de estado permitidas
CREATE TABLE fx_operation_status_transition (
    id SERIAL PRIMARY KEY,
    from_status_id INTEGER NOT NULL REFERENCES fx_operation_status(id),
    to_status_id INTEGER NOT NULL REFERENCES fx_operation_status(id),
    requires_approval BOOLEAN DEFAULT FALSE,
    allowed_profiles TEXT[],                 -- Array de perfiles que pueden hacer la transición
    UNIQUE(from_status_id, to_status_id)
);