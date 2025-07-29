-- Elimina (borrado físico) un registro de la tabla quote_origin
CREATE OR REPLACE FUNCTION delete_quote_origin(
    p_id INTEGER
) RETURNS quote_origin AS $$
DECLARE
    deleted_quote_origin quote_origin;
BEGIN
    DELETE FROM quote_origin WHERE id = p_id RETURNING * INTO deleted_quote_origin;
    RETURN deleted_quote_origin;
END;
$$ LANGUAGE plpgsql;
