-- Actualiza un registro en la tabla app_parameter
CREATE OR REPLACE FUNCTION update_app_parameter(
    p_id INTEGER,
    p_code VARCHAR(50),
    p_description VARCHAR(200),
    p_value_str1 VARCHAR(100),
    p_value_str2 VARCHAR(100),
    p_value_int1 INTEGER,
    p_value_int2 INTEGER,
    p_value_dec1 NUMERIC(18,6),
    p_value_dec2 NUMERIC(18,6),
    p_status VARCHAR(10),
    p_modified_by INTEGER
) RETURNS app_parameter AS $$
DECLARE
    updated_app_parameter app_parameter;
BEGIN
    UPDATE app_parameter SET
        code = p_code,
        description = p_description,
        value_str1 = p_value_str1,
        value_str2 = p_value_str2,
        value_int1 = p_value_int1,
        value_int2 = p_value_int2,
        value_dec1 = p_value_dec1,
        value_dec2 = p_value_dec2,
        status = p_status,
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO updated_app_parameter;
    RETURN updated_app_parameter;
END;
$$ LANGUAGE plpgsql;
