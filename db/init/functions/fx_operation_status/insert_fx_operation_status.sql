-- Inserta un registro en la tabla fx_operation_status
CREATE OR REPLACE FUNCTION insert_fx_operation_status(
    p_code VARCHAR(30),
    p_description VARCHAR(100),
    p_display_order INTEGER
) RETURNS fx_operation_status AS $$
DECLARE
    new_fx_operation_status fx_operation_status;
BEGIN
    INSERT INTO fx_operation_status (
        code, description, display_order
    ) VALUES (
        p_code, p_description, p_display_order
    ) RETURNING * INTO new_fx_operation_status;
    RETURN new_fx_operation_status;
END;
$$ LANGUAGE plpgsql;
