-- Inserta un registro en la tabla fx_price
CREATE OR REPLACE FUNCTION insert_fx_price(
    p_currency_id INTEGER,
    p_fx_product_id INTEGER,
    p_price_date DATE,
    p_price_bid NUMERIC(18,6),
    p_price_mid NUMERIC(18,6),
    p_price_offer NUMERIC(18,6),
    p_info_source VARCHAR(50)
) RETURNS fx_price AS $$
DECLARE
    new_fx_price fx_price;
BEGIN
    INSERT INTO fx_price (
        currency_id, fx_product_id, price_date, price_bid, price_mid, price_offer, info_source
    ) VALUES (
        p_currency_id, p_fx_product_id, p_price_date, p_price_bid, p_price_mid, p_price_offer, p_info_source
    ) RETURNING * INTO new_fx_price;
    RETURN new_fx_price;
END;
$$ LANGUAGE plpgsql;
