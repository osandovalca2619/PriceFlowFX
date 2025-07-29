-- Actualiza un registro en la tabla market_scenario
CREATE OR REPLACE FUNCTION update_market_scenario(
    p_id INTEGER,
    p_name VARCHAR(20),
    p_description VARCHAR(100)
) RETURNS market_scenario AS $$
DECLARE
    updated_market_scenario market_scenario;
BEGIN
    UPDATE market_scenario SET
        name = p_name,
        description = p_description
    WHERE id = p_id
    RETURNING * INTO updated_market_scenario;
    RETURN updated_market_scenario;
END;
$$ LANGUAGE plpgsql;
