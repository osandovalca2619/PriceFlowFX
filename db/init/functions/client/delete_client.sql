-- Elimina (borrado lógico) un registro de la tabla client
CREATE OR REPLACE FUNCTION delete_client(
    p_id INTEGER,
    p_modified_by INTEGER
) RETURNS client AS $$
DECLARE
    deleted_client client;
BEGIN
    UPDATE client SET
        status = 'inactivo',
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO deleted_client;
    RETURN deleted_client;
END;
$$ LANGUAGE plpgsql;
