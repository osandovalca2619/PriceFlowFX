-- Elimina (borrado físico) un registro de la tabla currency_country
CREATE OR REPLACE FUNCTION delete_currency_country(
    p_id INTEGER
) RETURNS currency_country AS $$
DECLARE
    deleted_currency_country currency_country;
BEGIN
    DELETE FROM currency_country WHERE id = p_id RETURNING * INTO deleted_currency_country;
    RETURN deleted_currency_country;
END;
$$ LANGUAGE plpgsql;
