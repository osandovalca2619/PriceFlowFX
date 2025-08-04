-- Tabla principal de operaciones Forward
-- Almacena las operaciones Forward de FX realizadas por los clientes
CREATE TABLE fx_operation_forward (
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
    -- Campos específicos de Forward:
    forward_expiry_date DATE NOT NULL,
    fixing_date DATE,
    info_source VARCHAR(50),
    reference_index VARCHAR(50),
    settlement_type VARCHAR(30),
    has_split BOOLEAN DEFAULT FALSE,
    split_currency_pair VARCHAR(7),
    split_amount NUMERIC(18,2),
    settlement_currency_id INTEGER REFERENCES currency(id) ON DELETE SET NULL ON UPDATE CASCADE, -- Divisa de liquidación
    tenor_days INTEGER,                                    -- Plazo en días
    cost_price_usd NUMERIC(18,6),                          -- Precio costo divisa USD
    client_price_usd NUMERIC(18,6),                        -- Precio cliente divisa USD
    forward_points NUMERIC(18,6),                          -- Puntos forward
    forward_margin NUMERIC(8,4),                           -- Margen forward
    client_price_spot NUMERIC(18,6),                       -- Precio cliente spot
    client_price_forward NUMERIC(18,6),                    -- Precio cliente forward
    pnl_calculated NUMERIC(18,2),                        -- PnL calculado
    workflow_step VARCHAR(30), 
    created_by INTEGER NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER REFERENCES app_user(id) ON DELETE RESTRICT,
    modified_at TIMESTAMP,
    -- La cancelación se gestiona con el campo status y auditoría
    CONSTRAINT fx_operation_forward_side_check CHECK (operation_side IN ('buy', 'sell'))
);

CREATE INDEX idx_fx_operation_forward_client_id ON fx_operation_forward(client_id);
CREATE INDEX idx_fx_operation_forward_user_id ON fx_operation_forward(user_id);
CREATE INDEX idx_fx_operation_forward_base_currency_id ON fx_operation_forward(base_currency_id);
CREATE INDEX idx_fx_operation_forward_quote_currency_id ON fx_operation_forward(quote_currency_id);
CREATE INDEX idx_fx_operation_forward_status_id ON fx_operation_forward(status_id);
CREATE INDEX idx_fx_operation_forward_start_date ON fx_operation_forward(start_date);
CREATE INDEX idx_fx_operation_forward_value_date ON fx_operation_forward(value_date);

COMMENT ON TABLE fx_operation_forward IS 'Almacena las operaciones Forward de FX realizadas por los clientes';
COMMENT ON COLUMN fx_operation_forward.client_id IS 'Cliente que realiza la operación (FK a client)';
COMMENT ON COLUMN fx_operation_forward.user_id IS 'Usuario que registra la operación (FK a app_user)';
COMMENT ON COLUMN fx_operation_forward.base_currency_id IS 'Moneda base (FK a currency)';
COMMENT ON COLUMN fx_operation_forward.quote_currency_id IS 'Moneda cotizada (FK a currency)';
COMMENT ON COLUMN fx_operation_forward.status_id IS 'Estado de la operación (FK a fx_operation_status)';
COMMENT ON COLUMN fx_operation_forward.operation_side IS 'Sentido de la operación: buy o sell';
