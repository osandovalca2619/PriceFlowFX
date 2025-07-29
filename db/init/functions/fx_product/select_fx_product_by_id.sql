-- Consulta un registro de la tabla fx_product por id
CREATE OR REPLACE FUNCTION select_fx_product_by_id(
    p_id INTEGER
) RETURNS fx_product AS $$
DECLARE
    result fx_product;
BEGIN
    SELECT * INTO result FROM fx_product WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
