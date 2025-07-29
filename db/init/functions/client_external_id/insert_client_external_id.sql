-- Inserta un registro en la tabla client_external_id
CREATE OR REPLACE FUNCTION insert_client_external_id(
    p_client_id INTEGER,
    p_origin_system VARCHAR(30),
    p_origin_code VARCHAR(50)
) RETURNS client_external_id AS $$
DECLARE
    new_client_external_id client_external_id;
BEGIN
    INSERT INTO client_external_id (
        client_id, origin_system, origin_code
    ) VALUES (
        p_client_id, p_origin_system, p_origin_code
    ) RETURNING * INTO new_client_external_id;
    RETURN new_client_external_id;
END;
$$ LANGUAGE plpgsql;
