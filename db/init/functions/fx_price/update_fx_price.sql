-- Actualiza un registro en la tabla fx_price
CREATE OR REPLACE FUNCTION update_fx_price(
    p_id INTEGER,
    p_currency_id INTEGER,
    p_fx_product_id INTEGER,
    p_price_date DATE,
    p_price_bid NUMERIC(18,6),
    p_price_mid NUMERIC(18,6),
    p_price_offer NUMERIC(18,6),
    p_info_source VARCHAR(50)
) RETURNS fx_price AS $$
DECLARE
    updated_fx_price fx_price;
BEGIN
    UPDATE fx_price SET
        currency_id = p_currency_id,
        fx_product_id = p_fx_product_id,
        price_date = p_price_date,
        price_bid = p_price_bid,
        price_mid = p_price_mid,
        price_offer = p_price_offer,
        info_source = p_info_source,
        updated_at = NOW()
    WHERE id = p_id
    RETURNING * INTO updated_fx_price;
    RETURN updated_fx_price;
END;
$$ LANGUAGE plpgsql;
