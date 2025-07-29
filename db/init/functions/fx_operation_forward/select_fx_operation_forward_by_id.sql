-- Consulta un registro de la tabla fx_operation_forward por id
CREATE OR REPLACE FUNCTION select_fx_operation_forward_by_id(
    p_id INTEGER
) RETURNS fx_operation_forward AS $$
DECLARE
    result fx_operation_forward;
BEGIN
    SELECT * INTO result FROM fx_operation_forward WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
