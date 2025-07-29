-- Elimina (borrado físico) un registro de la tabla sales_group
CREATE OR REPLACE FUNCTION delete_sales_group(
    p_id INTEGER
) RETURNS sales_group AS $$
DECLARE
    deleted_sales_group sales_group;
BEGIN
    DELETE FROM sales_group WHERE id = p_id RETURNING * INTO deleted_sales_group;
    RETURN deleted_sales_group;
END;
$$ LANGUAGE plpgsql;
