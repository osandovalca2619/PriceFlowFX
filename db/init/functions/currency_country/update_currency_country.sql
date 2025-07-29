-- Actualiza un registro en la tabla currency_country
CREATE OR REPLACE FUNCTION update_currency_country(
    p_id INTEGER,
    p_currency_id INTEGER,
    p_country_id INTEGER
) RETURNS currency_country AS $$
DECLARE
    updated_currency_country currency_country;
BEGIN
    UPDATE currency_country SET
        currency_id = p_currency_id,
        country_id = p_country_id
    WHERE id = p_id
    RETURNING * INTO updated_currency_country;
    RETURN updated_currency_country;
END;
$$ LANGUAGE plpgsql;
