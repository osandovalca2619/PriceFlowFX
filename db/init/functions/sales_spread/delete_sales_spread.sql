-- Elimina (borrado físico) un registro de la tabla sales_spread
CREATE OR REPLACE FUNCTION delete_sales_spread(
    p_id INTEGER
) RETURNS sales_spread AS $$
DECLARE
    deleted_sales_spread sales_spread;
BEGIN
    DELETE FROM sales_spread WHERE id = p_id RETURNING * INTO deleted_sales_spread;
    RETURN deleted_sales_spread;
END;
$$ LANGUAGE plpgsql;
