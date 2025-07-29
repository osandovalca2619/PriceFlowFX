-- Consulta un registro de la tabla currency_country por id
CREATE OR REPLACE FUNCTION select_currency_country_by_id(
    p_id INTEGER
) RETURNS currency_country AS $$
DECLARE
    result currency_country;
BEGIN
    SELECT * INTO result FROM currency_country WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
