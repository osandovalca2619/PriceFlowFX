-- Consulta un registro de la tabla client por id
CREATE OR REPLACE FUNCTION select_client_by_id(
    p_id INTEGER
) RETURNS client AS $$
DECLARE
    result client;
BEGIN
    SELECT * INTO result FROM client WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
