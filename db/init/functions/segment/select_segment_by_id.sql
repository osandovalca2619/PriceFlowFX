-- Consulta un registro de la tabla segment por id
CREATE OR REPLACE FUNCTION select_segment_by_id(
    p_id INTEGER
) RETURNS segment AS $$
DECLARE
    result segment;
BEGIN
    SELECT * INTO result FROM segment WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
