-- Elimina (borrado físico) un registro de la tabla segment
CREATE OR REPLACE FUNCTION delete_segment(
    p_id INTEGER
) RETURNS segment AS $$
DECLARE
    deleted_segment segment;
BEGIN
    DELETE FROM segment WHERE id = p_id RETURNING * INTO deleted_segment;
    RETURN deleted_segment;
END;
$$ LANGUAGE plpgsql;
