-- Tabla de spread de ventas
-- Define los spreads de venta por moneda, origen, segmento y producto FX
CREATE TABLE sales_spread (
    id SERIAL PRIMARY KEY,
    base_currency_id INTEGER NOT NULL REFERENCES currency(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quote_currency_id INTEGER NOT NULL REFERENCES currency(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    origin_id INTEGER NOT NULL REFERENCES quote_origin(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    segment_id INTEGER NOT NULL REFERENCES segment(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    fx_product_id INTEGER NOT NULL REFERENCES fx_product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    market_hours BOOLEAN NOT NULL,           -- TRUE: dentro de horario, FALSE: fuera
    spread_buy NUMERIC(8,4) NOT NULL,        -- Spread para compra
    spread_sell NUMERIC(8,4) NOT NULL,       -- Spread para venta
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sales_spread_base_currency_id ON sales_spread(base_currency_id);
CREATE INDEX idx_sales_spread_quote_currency_id ON sales_spread(quote_currency_id);
CREATE INDEX idx_sales_spread_origin_id ON sales_spread(origin_id);
CREATE INDEX idx_sales_spread_segment_id ON sales_spread(segment_id);
CREATE INDEX idx_sales_spread_fx_product_id ON sales_spread(fx_product_id);
CREATE INDEX idx_sales_spread_market_hours ON sales_spread(market_hours);

COMMENT ON TABLE sales_spread IS 'Define los spreads de venta por moneda, origen, segmento y producto FX';
COMMENT ON COLUMN sales_spread.base_currency_id IS 'Moneda base (FK a currency)';
COMMENT ON COLUMN sales_spread.quote_currency_id IS 'Moneda cotizada (FK a currency)';
COMMENT ON COLUMN sales_spread.origin_id IS 'Origen de cotización (FK a quote_origin)';
COMMENT ON COLUMN sales_spread.segment_id IS 'Segmento de cliente (FK a segment)';
COMMENT ON COLUMN sales_spread.fx_product_id IS 'Producto FX (FK a fx_product)';
COMMENT ON COLUMN sales_spread.market_hours IS 'TRUE: dentro de horario, FALSE: fuera';
COMMENT ON COLUMN sales_spread.spread_buy IS 'Spread para compra';
COMMENT ON COLUMN sales_spread.spread_sell IS 'Spread para venta';
