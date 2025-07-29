-- Actualiza un registro en la tabla fx_operation_status
CREATE OR REPLACE FUNCTION update_fx_operation_status(
    p_id INTEGER,
    p_code VARCHAR(30),
    p_description VARCHAR(100),
    p_display_order INTEGER
) RETURNS fx_operation_status AS $$
DECLARE
    updated_fx_operation_status fx_operation_status;
BEGIN
    UPDATE fx_operation_status SET
        code = p_code,
        description = p_description,
        display_order = p_display_order
    WHERE id = p_id
    RETURNING * INTO updated_fx_operation_status;
    RETURN updated_fx_operation_status;
END;
$$ LANGUAGE plpgsql;
