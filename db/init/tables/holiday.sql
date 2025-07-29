-- Tabla de feriados por país
-- Almacena los feriados de cada país
CREATE TABLE holiday (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    holiday_date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    UNIQUE(country_id, holiday_date)
);

CREATE INDEX idx_holiday_country_id ON holiday(country_id);
CREATE INDEX idx_holiday_holiday_date ON holiday(holiday_date);

COMMENT ON TABLE holiday IS 'Almacena los feriados de cada país';
COMMENT ON COLUMN holiday.country_id IS 'País del feriado (FK a country)';
COMMENT ON COLUMN holiday.holiday_date IS 'Fecha del feriado';
COMMENT ON COLUMN holiday.name IS 'Nombre del feriado';
COMMENT ON COLUMN holiday.description IS 'Descripción adicional del feriado';
