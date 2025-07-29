-- Inserta un registro en la tabla app_user_external_id
CREATE OR REPLACE FUNCTION insert_app_user_external_id(
    p_user_id INTEGER,
    p_origin_system VARCHAR(30),
    p_origin_code VARCHAR(50),
    p_client_id INTEGER
) RETURNS app_user_external_id AS $$
DECLARE
    new_app_user_external_id app_user_external_id;
BEGIN
    INSERT INTO app_user_external_id (
        user_id, origin_system, origin_code, client_id
    ) VALUES (
        p_user_id, p_origin_system, p_origin_code, p_client_id
    ) RETURNING * INTO new_app_user_external_id;
    RETURN new_app_user_external_id;
END;
$$ LANGUAGE plpgsql;
