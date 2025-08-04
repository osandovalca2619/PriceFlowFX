-- Tabla de precios por divisa y producto
-- Almacena los precios BID, MID y OFFER por moneda y producto FX en una fecha determinada
CREATE TABLE fx_price (
    id SERIAL PRIMARY KEY,
    base_currency_id INTEGER NOT NULL REFERENCES currency(id),
    quote_currency_id INTEGER NOT NULL REFERENCES currency(id),
    price_date DATE NOT NULL,
    price_bid NUMERIC(18,6),         -- Precio BID
    price_mid NUMERIC(18,6),         -- Precio MID
    price_offer NUMERIC(18,6),       -- Precio OFFER
    info_source VARCHAR(50),         -- Origen de la información (ej: Bloomberg, Datatec)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP             -- Fecha/hora de última actualización
    UNIQUE(base_currency_id, quote_currency_id, info_source)
);

CREATE INDEX idx_fx_price_currency_id ON fx_price(currency_id);
CREATE INDEX idx_fx_price_fx_product_id ON fx_price(fx_product_id);
CREATE INDEX idx_fx_price_price_date ON fx_price(price_date);

COMMENT ON TABLE fx_price IS 'Almacena los precios BID, MID y OFFER por moneda y producto FX en una fecha determinada';
COMMENT ON COLUMN fx_price.currency_id IS 'Moneda (FK a currency)';
COMMENT ON COLUMN fx_price.fx_product_id IS 'Producto FX (FK a fx_product)';
COMMENT ON COLUMN fx_price.price_date IS 'Fecha del precio';
COMMENT ON COLUMN fx_price.price_bid IS 'Precio BID';
COMMENT ON COLUMN fx_price.price_mid IS 'Precio MID';
COMMENT ON COLUMN fx_price.price_offer IS 'Precio OFFER';
COMMENT ON COLUMN fx_price.info_source IS 'Origen de la información';
