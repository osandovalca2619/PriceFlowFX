-- Elimina (borrado físico) un registro de la tabla fx_product
CREATE OR REPLACE FUNCTION delete_fx_product(
    p_id INTEGER
) RETURNS fx_product AS $$
DECLARE
    deleted_fx_product fx_product;
BEGIN
    DELETE FROM fx_product WHERE id = p_id RETURNING * INTO deleted_fx_product;
    RETURN deleted_fx_product;
END;
$$ LANGUAGE plpgsql;
