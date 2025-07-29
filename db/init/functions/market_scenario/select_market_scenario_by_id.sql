-- Consulta un registro de la tabla market_scenario por id
CREATE OR REPLACE FUNCTION select_market_scenario_by_id(
    p_id INTEGER
) RETURNS market_scenario AS $$
DECLARE
    result market_scenario;
BEGIN
    SELECT * INTO result FROM market_scenario WHERE id = p_id;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
