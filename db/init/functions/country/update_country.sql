-- Actualiza un registro en la tabla country
CREATE OR REPLACE FUNCTION update_country(
    p_id INTEGER,
    p_code VARCHAR(3),
    p_name VARCHAR(100)
) RETURNS country AS $$
DECLARE
    updated_country country;
BEGIN
    UPDATE country SET
        code = p_code,
        name = p_name
    WHERE id = p_id
    RETURNING * INTO updated_country;
    RETURN updated_country;
END;
$$ LANGUAGE plpgsql;
