-- Tabla de escenarios de mercado
-- Catálogo de escenarios de mercado para parametrización de spreads y riesgos
CREATE TABLE IF NOT EXISTS market_scenario (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(100),
    volatility_multiplier NUMERIC(4,2) DEFAULT 1.0,
    active BOOLEAN DEFAULT true
);

CREATE INDEX idx_market_scenario_name ON market_scenario(name);

COMMENT ON TABLE market_scenario IS 'Catálogo de escenarios de mercado para parametrización de spreads y riesgos';
COMMENT ON COLUMN market_scenario.name IS 'Nombre único del escenario de mercado';
COMMENT ON COLUMN market_scenario.description IS 'Descripción del escenario de mercado';

INSERT INTO market_scenario (code, name, description, volatility_multiplier, active) VALUES 
('NORMAL', 'Normal Market', 'Condiciones normales de mercado', 1.0, true),
('VOLATILE', 'Volatile Market', 'Mercado volátil', 1.5, true),
('HIGH_VOLATILE', 'High Volatile Market', 'Mercado de alta volatilidad', 2.0, true)
ON CONFLICT (code) DO NOTHING;
