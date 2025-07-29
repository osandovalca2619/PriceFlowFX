-- Actualiza un registro en la tabla fx_product
CREATE OR REPLACE FUNCTION update_fx_product(
    p_id INTEGER,
    p_name VARCHAR(20),
    p_description VARCHAR(100)
) RETURNS fx_product AS $$
DECLARE
    updated_fx_product fx_product;
BEGIN
    UPDATE fx_product SET
        name = p_name,
        description = p_description
    WHERE id = p_id
    RETURNING * INTO updated_fx_product;
    RETURN updated_fx_product;
END;
$$ LANGUAGE plpgsql;
