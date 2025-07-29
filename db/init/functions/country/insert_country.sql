-- Inserta un registro en la tabla country
CREATE OR REPLACE FUNCTION insert_country(
    p_code VARCHAR(3),
    p_name VARCHAR(100)
) RETURNS country AS $$
DECLARE
    new_country country;
BEGIN
    INSERT INTO country (
        code, name
    ) VALUES (
        p_code, p_name
    ) RETURNING * INTO new_country;
    RETURN new_country;
END;
$$ LANGUAGE plpgsql;
