-- Elimina (borrado lógico) un registro de la tabla currency
CREATE OR REPLACE FUNCTION delete_currency(
    p_id INTEGER,
    p_modified_by INTEGER
) RETURNS currency AS $$
DECLARE
    deleted_currency currency;
BEGIN
    UPDATE currency SET
        status = 'inactivo',
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO deleted_currency;
    RETURN deleted_currency;
END;
$$ LANGUAGE plpgsql;
