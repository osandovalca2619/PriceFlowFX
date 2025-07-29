-- Consulta un registro de la tabla country por id
CREATE OR REPLACE FUNCTION select_country_by_id(
    p_id INTEGER
) RETURNS country AS $$
DECLARE
    result country;
BEGIN
    SELECT * INTO result FROM country WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
