-- Consulta un registro de la tabla fx_price por id
CREATE OR REPLACE FUNCTION select_fx_price_by_id(
    p_id INTEGER
) RETURNS fx_price AS $$
DECLARE
    result fx_price;
BEGIN
    SELECT * INTO result FROM fx_price WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
