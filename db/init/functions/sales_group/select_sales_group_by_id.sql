-- Consulta un registro de la tabla sales_group por id
CREATE OR REPLACE FUNCTION select_sales_group_by_id(
    p_id INTEGER
) RETURNS sales_group AS $$
DECLARE
    result sales_group;
BEGIN
    SELECT * INTO result FROM sales_group WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
