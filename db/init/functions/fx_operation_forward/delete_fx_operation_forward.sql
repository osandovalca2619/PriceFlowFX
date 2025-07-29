-- Elimina (borrado lógico) un registro de la tabla fx_operation_forward
CREATE OR REPLACE FUNCTION delete_fx_operation_forward(
    p_id INTEGER,
    p_modified_by INTEGER
) RETURNS fx_operation_forward AS $$
DECLARE
    deleted_fx_operation_forward fx_operation_forward;
BEGIN
    UPDATE fx_operation_forward SET
        status_id = 3, -- Suponiendo que 3 es 'inactivo' o 'anulado'
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO deleted_fx_operation_forward;
    RETURN deleted_fx_operation_forward;
END;
$$ LANGUAGE plpgsql;
