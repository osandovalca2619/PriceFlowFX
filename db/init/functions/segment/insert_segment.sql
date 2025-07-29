-- Inserta un registro en la tabla segment
CREATE OR REPLACE FUNCTION insert_segment(
    p_name VARCHAR(30)
) RETURNS segment AS $$
DECLARE
    new_segment segment;
BEGIN
    INSERT INTO segment (
        name
    ) VALUES (
        p_name
    ) RETURNING * INTO new_segment;
    RETURN new_segment;
END;
$$ LANGUAGE plpgsql;
