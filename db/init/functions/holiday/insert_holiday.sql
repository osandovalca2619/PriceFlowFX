-- Inserta un registro en la tabla holiday
CREATE OR REPLACE FUNCTION insert_holiday(
    p_country_id INTEGER,
    p_holiday_date DATE,
    p_name VARCHAR(100),
    p_description TEXT
) RETURNS holiday AS $$
DECLARE
    new_holiday holiday;
BEGIN
    INSERT INTO holiday (
        country_id, holiday_date, name, description
    ) VALUES (
        p_country_id, p_holiday_date, p_name, p_description
    ) RETURNING * INTO new_holiday;
    RETURN new_holiday;
END;
$$ LANGUAGE plpgsql;
