-- Actualiza un registro en la tabla client
CREATE OR REPLACE FUNCTION update_client(
    p_id INTEGER,
    p_client_identifier VARCHAR(50),
    p_name VARCHAR(100),
    p_segment_id INTEGER,
    p_status VARCHAR(10),
    p_modified_by INTEGER
) RETURNS client AS $$
DECLARE
    updated_client client;
BEGIN
    UPDATE client SET
        client_identifier = p_client_identifier,
        name = p_name,
        segment_id = p_segment_id,
        status = p_status,
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO updated_client;
    RETURN updated_client;
END;
$$ LANGUAGE plpgsql;
