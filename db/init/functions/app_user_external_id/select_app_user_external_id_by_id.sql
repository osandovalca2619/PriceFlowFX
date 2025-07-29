-- Consulta un registro de la tabla app_user_external_id por id
CREATE OR REPLACE FUNCTION select_app_user_external_id_by_id(
    p_id INTEGER
) RETURNS app_user_external_id AS $$
DECLARE
    result app_user_external_id;
BEGIN
    SELECT * INTO result FROM app_user_external_id WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
