-- Consulta un registro de la tabla client_external_id por id
CREATE OR REPLACE FUNCTION select_client_external_id_by_id(
    p_id INTEGER
) RETURNS client_external_id AS $$
DECLARE
    result client_external_id;
BEGIN
    SELECT * INTO result FROM client_external_id WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
