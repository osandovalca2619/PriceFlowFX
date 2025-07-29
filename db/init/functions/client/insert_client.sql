-- Inserta un registro en la tabla client
CREATE OR REPLACE FUNCTION insert_client(
    p_client_identifier VARCHAR(50),
    p_name VARCHAR(100),
    p_segment_id INTEGER,
    p_status VARCHAR(10),
    p_created_by INTEGER
) RETURNS client AS $$
DECLARE
    new_client client;
BEGIN
    INSERT INTO client (
        client_identifier, name, segment_id, status, created_by
    ) VALUES (
        p_client_identifier, p_name, p_segment_id, p_status, p_created_by
    ) RETURNING * INTO new_client;
    RETURN new_client;
END;
$$ LANGUAGE plpgsql;
