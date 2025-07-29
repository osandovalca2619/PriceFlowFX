-- Inserta un registro en la tabla currency_country
CREATE OR REPLACE FUNCTION insert_currency_country(
    p_currency_id INTEGER,
    p_country_id INTEGER
) RETURNS currency_country AS $$
DECLARE
    new_currency_country currency_country;
BEGIN
    INSERT INTO currency_country (
        currency_id, country_id
    ) VALUES (
        p_currency_id, p_country_id
    ) RETURNING * INTO new_currency_country;
    RETURN new_currency_country;
END;
$$ LANGUAGE plpgsql;
