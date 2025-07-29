-- Inserta un registro en la tabla app_parameter
CREATE OR REPLACE FUNCTION insert_app_parameter(
    p_code VARCHAR(50),
    p_description VARCHAR(200),
    p_value_str1 VARCHAR(100),
    p_value_str2 VARCHAR(100),
    p_value_int1 INTEGER,
    p_value_int2 INTEGER,
    p_value_dec1 NUMERIC(18,6),
    p_value_dec2 NUMERIC(18,6),
    p_status VARCHAR(10),
    p_created_by INTEGER
) RETURNS app_parameter AS $$
DECLARE
    new_app_parameter app_parameter;
BEGIN
    INSERT INTO app_parameter (
        code, description, value_str1, value_str2, value_int1, value_int2, value_dec1, value_dec2, status, created_by
    ) VALUES (
        p_code, p_description, p_value_str1, p_value_str2, p_value_int1, p_value_int2, p_value_dec1, p_value_dec2, p_status, p_created_by
    ) RETURNING * INTO new_app_parameter;
    RETURN new_app_parameter;
END;
$$ LANGUAGE plpgsql;
