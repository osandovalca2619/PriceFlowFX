-- Inserta un registro en la tabla currency
CREATE OR REPLACE FUNCTION insert_currency(
    p_code VARCHAR(3),
    p_name VARCHAR(50),
    p_symbol VARCHAR(5),
    p_country VARCHAR(50),
    p_decimals INTEGER,
    p_is_strong_currency BOOLEAN,
    p_status VARCHAR(20),
    p_created_by INTEGER
) RETURNS currency AS $$
DECLARE
    new_currency currency;
BEGIN
    INSERT INTO currency (
        code, name, symbol, country, decimals, is_strong_currency, status, created_by
    ) VALUES (
        p_code, p_name, p_symbol, p_country, p_decimals, p_is_strong_currency, p_status, p_created_by
    ) RETURNING * INTO new_currency;
    RETURN new_currency;
END;
$$ LANGUAGE plpgsql;
