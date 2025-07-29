-- Inserta un registro en la tabla market_scenario
CREATE OR REPLACE FUNCTION insert_market_scenario(
    p_name VARCHAR(20),
    p_description VARCHAR(100)
) RETURNS market_scenario AS $$
DECLARE
    new_market_scenario market_scenario;
BEGIN
    INSERT INTO market_scenario (
        name, description
    ) VALUES (
        p_name, p_description
    ) RETURNING * INTO new_market_scenario;
    RETURN new_market_scenario;
END;
$$ LANGUAGE plpgsql;
