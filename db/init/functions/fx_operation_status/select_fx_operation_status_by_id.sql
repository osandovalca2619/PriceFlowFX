-- Consulta un registro de la tabla fx_operation_status por id
CREATE OR REPLACE FUNCTION select_fx_operation_status_by_id(
    p_id INTEGER
) RETURNS fx_operation_status AS $$
DECLARE
    result fx_operation_status;
BEGIN
    SELECT * INTO result FROM fx_operation_status WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
