-- Elimina (borrado físico) un registro de la tabla market_scenario
CREATE OR REPLACE FUNCTION delete_market_scenario(
    p_id INTEGER
) RETURNS market_scenario AS $$
DECLARE
    deleted_market_scenario market_scenario;
BEGIN
    DELETE FROM market_scenario WHERE id = p_id RETURNING * INTO deleted_market_scenario;
    RETURN deleted_market_scenario;
END;
$$ LANGUAGE plpgsql;
