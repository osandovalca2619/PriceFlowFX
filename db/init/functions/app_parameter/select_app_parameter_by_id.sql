-- Consulta un registro de la tabla app_parameter por id
CREATE OR REPLACE FUNCTION select_app_parameter_by_id(
    p_id INTEGER
) RETURNS app_parameter AS $$
DECLARE
    result app_parameter;
BEGIN
    SELECT * INTO result FROM app_parameter WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
