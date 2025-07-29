-- Inserta un registro en la tabla quote_origin
CREATE OR REPLACE FUNCTION insert_quote_origin(
    p_name VARCHAR(30)
) RETURNS quote_origin AS $$
DECLARE
    new_quote_origin quote_origin;
BEGIN
    INSERT INTO quote_origin (
        name
    ) VALUES (
        p_name
    ) RETURNING * INTO new_quote_origin;
    RETURN new_quote_origin;
END;
$$ LANGUAGE plpgsql;
