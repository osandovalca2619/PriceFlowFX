-- Elimina (borrado lógico) un registro de la tabla operation_folder
CREATE OR REPLACE FUNCTION delete_operation_folder(
    p_id INTEGER,
    p_modified_by INTEGER
) RETURNS operation_folder AS $$
DECLARE
    deleted_operation_folder operation_folder;
BEGIN
    UPDATE operation_folder SET
        status = 'inactivo',
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO deleted_operation_folder;
    RETURN deleted_operation_folder;
END;
$$ LANGUAGE plpgsql;
