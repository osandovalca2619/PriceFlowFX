-- Tabla de tramos de monto para spread de trading
-- Define los rangos de monto y spreads aplicados por moneda y escenario de mercado
CREATE TABLE trading_spread_range (
    id SERIAL PRIMARY KEY,
    currency_id INTEGER NOT NULL REFERENCES currency(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    scenario_id INTEGER NOT NULL REFERENCES market_scenario(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    amount_min NUMERIC(18,2) NOT NULL,
    amount_max NUMERIC(18,2) NOT NULL,
    spread NUMERIC(8,4) NOT NULL,            -- Spread aplicado
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT trading_spread_range_amount_check CHECK (amount_min < amount_max)
);

CREATE INDEX idx_trading_spread_range_currency_id ON trading_spread_range(currency_id);
CREATE INDEX idx_trading_spread_range_scenario_id ON trading_spread_range(scenario_id);
CREATE INDEX idx_trading_spread_range_amount_min ON trading_spread_range(amount_min);

COMMENT ON TABLE trading_spread_range IS 'Define los rangos de monto y spreads aplicados por moneda y escenario de mercado';
COMMENT ON COLUMN trading_spread_range.currency_id IS 'Moneda (FK a currency)';
COMMENT ON COLUMN trading_spread_range.scenario_id IS 'Escenario de mercado (FK a market_scenario)';
COMMENT ON COLUMN trading_spread_range.amount_min IS 'Monto mínimo del rango';
COMMENT ON COLUMN trading_spread_range.amount_max IS 'Monto máximo del rango';
COMMENT ON COLUMN trading_spread_range.spread IS 'Spread aplicado en el rango';
