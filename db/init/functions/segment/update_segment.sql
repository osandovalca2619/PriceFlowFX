-- Actualiza un registro en la tabla segment
CREATE OR REPLACE FUNCTION update_segment(
    p_id INTEGER,
    p_name VARCHAR(30)
) RETURNS segment AS $$
DECLARE
    updated_segment segment;
BEGIN
    UPDATE segment SET
        name = p_name
    WHERE id = p_id
    RETURNING * INTO updated_segment;
    RETURN updated_segment;
END;
$$ LANGUAGE plpgsql;
