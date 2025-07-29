-- Consulta un registro de la tabla quote_origin por id
CREATE OR REPLACE FUNCTION select_quote_origin_by_id(
    p_id INTEGER
) RETURNS quote_origin AS $$
DECLARE
    result quote_origin;
BEGIN
    SELECT * INTO result FROM quote_origin WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
