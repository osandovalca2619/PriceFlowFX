-- Actualiza un registro en la tabla quote_origin
CREATE OR REPLACE FUNCTION update_quote_origin(
    p_id INTEGER,
    p_name VARCHAR(30)
) RETURNS quote_origin AS $$
DECLARE
    updated_quote_origin quote_origin;
BEGIN
    UPDATE quote_origin SET
        name = p_name
    WHERE id = p_id
    RETURNING * INTO updated_quote_origin;
    RETURN updated_quote_origin;
END;
$$ LANGUAGE plpgsql;
