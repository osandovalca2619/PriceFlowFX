-- Elimina (borrado físico) un registro de la tabla fx_operation_status
CREATE OR REPLACE FUNCTION delete_fx_operation_status(
    p_id INTEGER
) RETURNS fx_operation_status AS $$
DECLARE
    deleted_fx_operation_status fx_operation_status;
BEGIN
    DELETE FROM fx_operation_status WHERE id = p_id RETURNING * INTO deleted_fx_operation_status;
    RETURN deleted_fx_operation_status;
END;
$$ LANGUAGE plpgsql;
