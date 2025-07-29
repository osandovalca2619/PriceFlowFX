-- Consulta un registro de la tabla app_user por id
CREATE OR REPLACE FUNCTION select_app_user_by_id(
    p_id INTEGER
) RETURNS app_user AS $$
DECLARE
    result app_user;
BEGIN
    SELECT * INTO result FROM app_user WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
