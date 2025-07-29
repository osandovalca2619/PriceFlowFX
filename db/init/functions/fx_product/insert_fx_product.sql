-- Inserta un registro en la tabla fx_product
CREATE OR REPLACE FUNCTION insert_fx_product(
    p_name VARCHAR(20),
    p_description VARCHAR(100)
) RETURNS fx_product AS $$
DECLARE
    new_fx_product fx_product;
BEGIN
    INSERT INTO fx_product (
        name, description
    ) VALUES (
        p_name, p_description
    ) RETURNING * INTO new_fx_product;
    RETURN new_fx_product;
END;
$$ LANGUAGE plpgsql;
