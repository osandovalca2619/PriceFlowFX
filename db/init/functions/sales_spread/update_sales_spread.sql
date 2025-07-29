-- Actualiza un registro en la tabla sales_spread
CREATE OR REPLACE FUNCTION update_sales_spread(
    p_id INTEGER,
    p_base_currency_id INTEGER,
    p_quote_currency_id INTEGER,
    p_origin_id INTEGER,
    p_segment_id INTEGER,
    p_fx_product_id INTEGER,
    p_market_hours BOOLEAN,
    p_spread_buy NUMERIC(8,4),
    p_spread_sell NUMERIC(8,4)
) RETURNS sales_spread AS $$
DECLARE
    updated_sales_spread sales_spread;
BEGIN
    UPDATE sales_spread SET
        base_currency_id = p_base_currency_id,
        quote_currency_id = p_quote_currency_id,
        origin_id = p_origin_id,
        segment_id = p_segment_id,
        fx_product_id = p_fx_product_id,
        market_hours = p_market_hours,
        spread_buy = p_spread_buy,
        spread_sell = p_spread_sell
    WHERE id = p_id
    RETURNING * INTO updated_sales_spread;
    RETURN updated_sales_spread;
END;
$$ LANGUAGE plpgsql;
