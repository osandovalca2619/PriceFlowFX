-- Inserta un registro en la tabla app_user
CREATE OR REPLACE FUNCTION insert_app_user(
    p_username VARCHAR(50),
    p_full_name VARCHAR(100),
    p_profile_id INTEGER,
    p_sales_group_id INTEGER,
    p_status VARCHAR(10),
    p_created_by INTEGER
) RETURNS app_user AS $$
DECLARE
    new_app_user app_user;
BEGIN
    INSERT INTO app_user (
        username, full_name, profile_id, sales_group_id, status, created_by
    ) VALUES (
        p_username, p_full_name, p_profile_id, p_sales_group_id, p_status, p_created_by
    ) RETURNING * INTO new_app_user;
    RETURN new_app_user;
END;
$$ LANGUAGE plpgsql;
