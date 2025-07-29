-- Actualiza un registro en la tabla currency
CREATE OR REPLACE FUNCTION update_currency(
    p_id INTEGER,
    p_code VARCHAR(3),
    p_name VARCHAR(50),
    p_symbol VARCHAR(5),
    p_country VARCHAR(50),
    p_decimals INTEGER,
    p_is_strong_currency BOOLEAN,
    p_status VARCHAR(20),
    p_modified_by INTEGER
) RETURNS currency AS $$
DECLARE
    updated_currency currency;
BEGIN
    UPDATE currency SET
        code = p_code,
        name = p_name,
        symbol = p_symbol,
        country = p_country,
        decimals = p_decimals,
        is_strong_currency = p_is_strong_currency,
        status = p_status,
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO updated_currency;
    RETURN updated_currency;
END;
$$ LANGUAGE plpgsql;
