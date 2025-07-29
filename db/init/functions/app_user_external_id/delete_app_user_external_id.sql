-- Elimina (borrado físico) un registro de la tabla app_user_external_id
CREATE OR REPLACE FUNCTION delete_app_user_external_id(
    p_id INTEGER
) RETURNS app_user_external_id AS $$
DECLARE
    deleted_app_user_external_id app_user_external_id;
BEGIN
    DELETE FROM app_user_external_id WHERE id = p_id RETURNING * INTO deleted_app_user_external_id;
    RETURN deleted_app_user_external_id;
END;
$$ LANGUAGE plpgsql;
