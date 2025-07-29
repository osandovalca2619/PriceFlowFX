-- Actualiza un registro en la tabla operation_folder
CREATE OR REPLACE FUNCTION update_operation_folder(
    p_id INTEGER,
    p_code VARCHAR(30),
    p_name VARCHAR(100),
    p_folder_type VARCHAR(10),
    p_status VARCHAR(10),
    p_modified_by INTEGER
) RETURNS operation_folder AS $$
DECLARE
    updated_operation_folder operation_folder;
BEGIN
    UPDATE operation_folder SET
        code = p_code,
        name = p_name,
        folder_type = p_folder_type,
        status = p_status,
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO updated_operation_folder;
    RETURN updated_operation_folder;
END;
$$ LANGUAGE plpgsql;
