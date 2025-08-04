-- Límites de trading por cliente
CREATE TABLE client_trading_limit (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES client(id),
    currency_id INTEGER NOT NULL REFERENCES currency(id),
    limit_type VARCHAR(20) NOT NULL,         -- 'daily', 'monthly', 'single_operation'
    limit_amount NUMERIC(18,2) NOT NULL,
    current_used NUMERIC(18,2) DEFAULT 0,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_by INTEGER NOT NULL REFERENCES app_user(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(client_id, currency_id, limit_type, effective_from)
);