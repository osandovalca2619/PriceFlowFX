-- Elimina (borrado físico) un registro de la tabla client_external_id
CREATE OR REPLACE FUNCTION delete_client_external_id(
    p_id INTEGER
) RETURNS client_external_id AS $$
DECLARE
    deleted_client_external_id client_external_id;
BEGIN
    DELETE FROM client_external_id WHERE id = p_id RETURNING * INTO deleted_client_external_id;
    RETURN deleted_client_external_id;
END;
$$ LANGUAGE plpgsql;
