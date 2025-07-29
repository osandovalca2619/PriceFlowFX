-- Tabla de escenarios de mercado
-- Catálogo de escenarios de mercado para parametrización de spreads y riesgos
CREATE TABLE market_scenario (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,               -- normal, volatile, high volatile
    description VARCHAR(100)
);

CREATE INDEX idx_market_scenario_name ON market_scenario(name);

COMMENT ON TABLE market_scenario IS 'Catálogo de escenarios de mercado para parametrización de spreads y riesgos';
COMMENT ON COLUMN market_scenario.name IS 'Nombre único del escenario de mercado';
COMMENT ON COLUMN market_scenario.description IS 'Descripción del escenario de mercado';
