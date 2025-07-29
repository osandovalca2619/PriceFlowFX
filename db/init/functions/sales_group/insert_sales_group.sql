-- Inserta un registro en la tabla sales_group
CREATE OR REPLACE FUNCTION insert_sales_group(
    p_name VARCHAR(50),
    p_description VARCHAR(100)
) RETURNS sales_group AS $$
DECLARE
    new_sales_group sales_group;
BEGIN
    INSERT INTO sales_group (
        name, description
    ) VALUES (
        p_name, p_description
    ) RETURNING * INTO new_sales_group;
    RETURN new_sales_group;
END;
$$ LANGUAGE plpgsql;
