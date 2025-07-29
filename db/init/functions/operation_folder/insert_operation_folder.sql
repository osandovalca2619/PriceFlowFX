-- Inserta un registro en la tabla operation_folder
CREATE OR REPLACE FUNCTION insert_operation_folder(
    p_code VARCHAR(30),
    p_name VARCHAR(100),
    p_folder_type VARCHAR(10),
    p_status VARCHAR(10),
    p_created_by INTEGER
) RETURNS operation_folder AS $$
DECLARE
    new_operation_folder operation_folder;
BEGIN
    INSERT INTO operation_folder (
        code, name, folder_type, status, created_by
    ) VALUES (
        p_code, p_name, p_folder_type, p_status, p_created_by
    ) RETURNING * INTO new_operation_folder;
    RETURN new_operation_folder;
END;
$$ LANGUAGE plpgsql;
