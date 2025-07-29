-- Elimina (borrado lógico) un registro de la tabla fx_operation_spot
CREATE OR REPLACE FUNCTION delete_fx_operation_spot(
    p_id INTEGER,
    p_modified_by INTEGER
) RETURNS fx_operation_spot AS $$
DECLARE
    deleted_fx_operation_spot fx_operation_spot;
BEGIN
    UPDATE fx_operation_spot SET
        status_id = 3, -- Suponiendo que 3 es 'inactivo' o 'anulado'
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO deleted_fx_operation_spot;
    RETURN deleted_fx_operation_spot;
END;
$$ LANGUAGE plpgsql;
