-- Actualiza un registro en la tabla app_user
CREATE OR REPLACE FUNCTION update_app_user(
    p_id INTEGER,
    p_username VARCHAR(50),
    p_full_name VARCHAR(100),
    p_profile_id INTEGER,
    p_sales_group_id INTEGER,
    p_status VARCHAR(10),
    p_modified_by INTEGER
) RETURNS app_user AS $$
DECLARE
    updated_app_user app_user;
BEGIN
    UPDATE app_user SET
        username = p_username,
        full_name = p_full_name,
        profile_id = p_profile_id,
        sales_group_id = p_sales_group_id,
        status = p_status,
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO updated_app_user;
    RETURN updated_app_user;
END;
$$ LANGUAGE plpgsql;
