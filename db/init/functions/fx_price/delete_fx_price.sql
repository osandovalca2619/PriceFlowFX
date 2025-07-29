-- Elimina (borrado físico) un registro de la tabla fx_price
CREATE OR REPLACE FUNCTION delete_fx_price(
    p_id INTEGER
) RETURNS fx_price AS $$
DECLARE
    deleted_fx_price fx_price;
BEGIN
    DELETE FROM fx_price WHERE id = p_id RETURNING * INTO deleted_fx_price;
    RETURN deleted_fx_price;
END;
$$ LANGUAGE plpgsql;
