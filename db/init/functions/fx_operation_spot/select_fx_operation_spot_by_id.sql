-- Consulta un registro de la tabla fx_operation_spot por id
CREATE OR REPLACE FUNCTION select_fx_operation_spot_by_id(
    p_id INTEGER
) RETURNS fx_operation_spot AS $$
DECLARE
    result fx_operation_spot;
BEGIN
    SELECT * INTO result FROM fx_operation_spot WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
