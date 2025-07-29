-- Consulta un registro de la tabla sales_spread por id
CREATE OR REPLACE FUNCTION select_sales_spread_by_id(
    p_id INTEGER
) RETURNS sales_spread AS $$
DECLARE
    result sales_spread;
BEGIN
    SELECT * INTO result FROM sales_spread WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
