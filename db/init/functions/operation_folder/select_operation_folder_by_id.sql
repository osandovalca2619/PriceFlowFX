-- Consulta un registro de la tabla operation_folder por id
CREATE OR REPLACE FUNCTION select_operation_folder_by_id(
    p_id INTEGER
) RETURNS operation_folder AS $$
DECLARE
    result operation_folder;
BEGIN
    SELECT * INTO result FROM operation_folder WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
