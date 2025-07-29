-- Actualiza un registro en la tabla holiday
CREATE OR REPLACE FUNCTION update_holiday(
    p_id INTEGER,
    p_country_id INTEGER,
    p_holiday_date DATE,
    p_name VARCHAR(100),
    p_description TEXT
) RETURNS holiday AS $$
DECLARE
    updated_holiday holiday;
BEGIN
    UPDATE holiday SET
        country_id = p_country_id,
        holiday_date = p_holiday_date,
        name = p_name,
        description = p_description
    WHERE id = p_id
    RETURNING * INTO updated_holiday;
    RETURN updated_holiday;
END;
$$ LANGUAGE plpgsql;
