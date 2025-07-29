-- Elimina (borrado lógico) un registro de la tabla app_user
CREATE OR REPLACE FUNCTION delete_app_user(
    p_id INTEGER,
    p_modified_by INTEGER
) RETURNS app_user AS $$
DECLARE
    deleted_app_user app_user;
BEGIN
    UPDATE app_user SET
        status = 'inactivo',
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO deleted_app_user;
    RETURN deleted_app_user;
END;
$$ LANGUAGE plpgsql;
