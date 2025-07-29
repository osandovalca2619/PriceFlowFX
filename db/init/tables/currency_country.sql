-- Relaciona divisas con países (por si una divisa es usada en varios países)
-- Relación N:M entre currency y country
CREATE TABLE currency_country (
    id SERIAL PRIMARY KEY,
    currency_id INTEGER NOT NULL REFERENCES currency(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE(currency_id, country_id)
);

CREATE INDEX idx_currency_country_currency_id ON currency_country(currency_id);
CREATE INDEX idx_currency_country_country_id ON currency_country(country_id);

COMMENT ON TABLE currency_country IS 'Relación N:M entre currency y country';
COMMENT ON COLUMN currency_country.currency_id IS 'Divisa (FK a currency)';
COMMENT ON COLUMN currency_country.country_id IS 'País (FK a country)';
