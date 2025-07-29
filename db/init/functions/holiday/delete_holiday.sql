-- Elimina (borrado físico) un registro de la tabla holiday
CREATE OR REPLACE FUNCTION delete_holiday(
    p_id INTEGER
) RETURNS holiday AS $$
DECLARE
    deleted_holiday holiday;
BEGIN
    DELETE FROM holiday WHERE id = p_id RETURNING * INTO deleted_holiday;
    RETURN deleted_holiday;
END;
$$ LANGUAGE plpgsql;
