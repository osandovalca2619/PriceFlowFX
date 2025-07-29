-- Actualiza un registro en la tabla sales_group
CREATE OR REPLACE FUNCTION update_sales_group(
    p_id INTEGER,
    p_name VARCHAR(50),
    p_description VARCHAR(100)
) RETURNS sales_group AS $$
DECLARE
    updated_sales_group sales_group;
BEGIN
    UPDATE sales_group SET
        name = p_name,
        description = p_description
    WHERE id = p_id
    RETURNING * INTO updated_sales_group;
    RETURN updated_sales_group;
END;
$$ LANGUAGE plpgsql;
