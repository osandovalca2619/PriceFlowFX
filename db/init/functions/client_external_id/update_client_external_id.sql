-- Actualiza un registro en la tabla client_external_id
CREATE OR REPLACE FUNCTION update_client_external_id(
    p_id INTEGER,
    p_client_id INTEGER,
    p_origin_system VARCHAR(30),
    p_origin_code VARCHAR(50)
) RETURNS client_external_id AS $$
DECLARE
    updated_client_external_id client_external_id;
BEGIN
    UPDATE client_external_id SET
        client_id = p_client_id,
        origin_system = p_origin_system,
        origin_code = p_origin_code
    WHERE id = p_id
    RETURNING * INTO updated_client_external_id;
    RETURN updated_client_external_id;
END;
$$ LANGUAGE plpgsql;
