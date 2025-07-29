-- Elimina (borrado físico) un registro de la tabla country
CREATE OR REPLACE FUNCTION delete_country(
    p_id INTEGER
) RETURNS country AS $$
DECLARE
    deleted_country country;
BEGIN
    DELETE FROM country WHERE id = p_id RETURNING * INTO deleted_country;
    RETURN deleted_country;
END;
$$ LANGUAGE plpgsql;
