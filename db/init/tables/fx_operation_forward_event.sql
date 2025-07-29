-- Tabla de eventos para operaciones Forward
-- Almacena los eventos y cambios de estado de las operaciones Forward
CREATE TABLE fx_operation_forward_event (
    id SERIAL PRIMARY KEY,
    fx_operation_forward_id INTEGER NOT NULL REFERENCES fx_operation_forward(id) ON DELETE CASCADE ON UPDATE CASCADE,
    event_type_id INTEGER NOT NULL REFERENCES fx_operation_event_type(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    event_timestamp TIMESTAMP DEFAULT NOW(),
    event_user_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT ON UPDATE CASCADE,

    -- Copia de todos los campos de fx_operation_forward
    client_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount_currency1 NUMERIC(18,2) NOT NULL,
    amount_currency2 NUMERIC(18,2) NOT NULL,
    cost_price NUMERIC(18,6) NOT NULL,
    margin NUMERIC(8,4) NOT NULL,
    client_price NUMERIC(18,6) NOT NULL,
    start_date DATE NOT NULL,
    register_date TIMESTAMP,
    value_date DATE NOT NULL,
    payment_method_currency1 VARCHAR(30),
    payment_method_currency2 VARCHAR(30),
    operation_side VARCHAR(10) NOT NULL,
    base_currency_id INTEGER,
    quote_currency_id INTEGER,
    origin_id INTEGER,
    segment_id INTEGER,
    destination_system_id INTEGER,
    source_system_id INTEGER,
    comments TEXT,
    trading_folder_id INTEGER,
    sales_folder_id INTEGER,
    status_id INTEGER,
    forward_expiry_date DATE,
    fixing_date DATE,
    info_source VARCHAR(50),
    reference_index VARCHAR(50),
    settlement_type VARCHAR(30),
    has_split BOOLEAN,
    split_currency_pair VARCHAR(7),
    split_amount NUMERIC(18,2),
    settlement_currency_id INTEGER,
    tenor_days INTEGER,
    cost_price_usd NUMERIC(18,6),
    client_price_usd NUMERIC(18,6),
    forward_points NUMERIC(18,6),
    forward_margin NUMERIC(8,4),
    client_price_spot NUMERIC(18,6),
    client_price_forward NUMERIC(18,6),
    created_by INTEGER,
    created_at TIMESTAMP,
    modified_by INTEGER,
    modified_at TIMESTAMP,
    cancelled_by INTEGER,
    cancelled_at TIMESTAMP
);

CREATE INDEX idx_fx_operation_forward_event_fx_operation_forward_id ON fx_operation_forward_event(fx_operation_forward_id);
CREATE INDEX idx_fx_operation_forward_event_event_type_id ON fx_operation_forward_event(event_type_id);
CREATE INDEX idx_fx_operation_forward_event_event_user_id ON fx_operation_forward_event(event_user_id);
CREATE INDEX idx_fx_operation_forward_event_event_timestamp ON fx_operation_forward_event(event_timestamp);

COMMENT ON TABLE fx_operation_forward_event IS 'Almacena los eventos y cambios de estado de las operaciones Forward';
COMMENT ON COLUMN fx_operation_forward_event.fx_operation_forward_id IS 'Operación Forward relacionada (FK a fx_operation_forward)';
COMMENT ON COLUMN fx_operation_forward_event.event_type_id IS 'Tipo de evento (FK a fx_operation_event_type)';
COMMENT ON COLUMN fx_operation_forward_event.event_user_id IS 'Usuario que genera el evento (FK a app_user)';
COMMENT ON COLUMN fx_operation_forward_event.event_timestamp IS 'Fecha y hora del evento';
