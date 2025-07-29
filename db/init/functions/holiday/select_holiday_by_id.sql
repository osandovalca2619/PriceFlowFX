-- Consulta un registro de la tabla holiday por id
CREATE OR REPLACE FUNCTION select_holiday_by_id(
    p_id INTEGER
) RETURNS holiday AS $$
DECLARE
    result holiday;
BEGIN
    SELECT * INTO result FROM holiday WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
