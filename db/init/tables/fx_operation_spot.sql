-- Tabla principal de operaciones Spot
-- Almacena las operaciones Spot de FX realizadas por los clientes
CREATE TABLE fx_operation_spot (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES client(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    user_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    amount_currency1 NUMERIC(18,2) NOT NULL,
    amount_currency2 NUMERIC(18,2) NOT NULL,
    cost_price NUMERIC(18,6) NOT NULL,
    margin NUMERIC(8,4) NOT NULL,
    client_price NUMERIC(18,6) NOT NULL,
    start_date DATE NOT NULL,
    register_date TIMESTAMP DEFAULT NOW(),
    value_date DATE NOT NULL,
    payment_method_currency1 VARCHAR(30),
    payment_method_currency2 VARCHAR(30),
    operation_side VARCHAR(10) NOT NULL CHECK (operation_side IN ('buy', 'sell')),
    base_currency_id INTEGER NOT NULL REFERENCES currency(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quote_currency_id INTEGER NOT NULL REFERENCES currency(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    origin_id INTEGER NOT NULL REFERENCES quote_origin(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    segment_id INTEGER NOT NULL REFERENCES segment(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    destination_system_id INTEGER,
    source_system_id INTEGER,
    comments TEXT,
    trading_folder_id INTEGER REFERENCES operation_folder(id) ON DELETE SET NULL ON UPDATE CASCADE,
    sales_folder_id INTEGER REFERENCES operation_folder(id) ON DELETE SET NULL ON UPDATE CASCADE,
    status_id INTEGER NOT NULL REFERENCES fx_operation_status(id) DEFAULT 2,
    created_by INTEGER NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER REFERENCES app_user(id) ON DELETE RESTRICT,
    modified_at TIMESTAMP,
    -- La cancelación se gestiona con el campo status y auditoría
    CONSTRAINT fx_operation_spot_side_check CHECK (operation_side IN ('buy', 'sell'))
);

CREATE INDEX idx_fx_operation_spot_client_id ON fx_operation_spot(client_id);
CREATE INDEX idx_fx_operation_spot_user_id ON fx_operation_spot(user_id);
CREATE INDEX idx_fx_operation_spot_base_currency_id ON fx_operation_spot(base_currency_id);
CREATE INDEX idx_fx_operation_spot_quote_currency_id ON fx_operation_spot(quote_currency_id);
CREATE INDEX idx_fx_operation_spot_status_id ON fx_operation_spot(status_id);
CREATE INDEX idx_fx_operation_spot_start_date ON fx_operation_spot(start_date);
CREATE INDEX idx_fx_operation_spot_value_date ON fx_operation_spot(value_date);

COMMENT ON TABLE fx_operation_spot IS 'Almacena las operaciones Spot de FX realizadas por los clientes';
COMMENT ON COLUMN fx_operation_spot.client_id IS 'Cliente que realiza la operación (FK a client)';
COMMENT ON COLUMN fx_operation_spot.user_id IS 'Usuario que registra la operación (FK a app_user)';
COMMENT ON COLUMN fx_operation_spot.base_currency_id IS 'Moneda base (FK a currency)';
COMMENT ON COLUMN fx_operation_spot.quote_currency_id IS 'Moneda cotizada (FK a currency)';
COMMENT ON COLUMN fx_operation_spot.status_id IS 'Estado de la operación (FK a fx_operation_status)';
COMMENT ON COLUMN fx_operation_spot.operation_side IS 'Sentido de la operación: buy o sell';
