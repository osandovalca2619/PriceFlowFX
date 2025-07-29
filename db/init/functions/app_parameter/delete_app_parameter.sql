-- Elimina (borrado lógico) un registro de la tabla app_parameter
CREATE OR REPLACE FUNCTION delete_app_parameter(
    p_id INTEGER,
    p_modified_by INTEGER
) RETURNS app_parameter AS $$
DECLARE
    deleted_app_parameter app_parameter;
BEGIN
    UPDATE app_parameter SET
        status = 'inactivo',
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO deleted_app_parameter;
    RETURN deleted_app_parameter;
END;
$$ LANGUAGE plpgsql;
