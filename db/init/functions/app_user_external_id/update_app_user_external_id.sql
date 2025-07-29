-- Actualiza un registro en la tabla app_user_external_id
CREATE OR REPLACE FUNCTION update_app_user_external_id(
    p_id INTEGER,
    p_user_id INTEGER,
    p_origin_system VARCHAR(30),
    p_origin_code VARCHAR(50),
    p_client_id INTEGER
) RETURNS app_user_external_id AS $$
DECLARE
    updated_app_user_external_id app_user_external_id;
BEGIN
    UPDATE app_user_external_id SET
        user_id = p_user_id,
        origin_system = p_origin_system,
        origin_code = p_origin_code,
        client_id = p_client_id
    WHERE id = p_id
    RETURNING * INTO updated_app_user_external_id;
    RETURN updated_app_user_external_id;
END;
$$ LANGUAGE plpgsql;
