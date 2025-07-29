-- Consulta un registro de la tabla currency por id
CREATE OR REPLACE FUNCTION select_currency_by_id(
    p_id INTEGER
) RETURNS currency AS $$
DECLARE
    result currency;
BEGIN
    SELECT * INTO result FROM currency WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
