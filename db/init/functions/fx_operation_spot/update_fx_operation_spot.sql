-- Actualiza un registro en la tabla fx_operation_spot
CREATE OR REPLACE FUNCTION update_fx_operation_spot(
    p_id INTEGER,
    p_client_id INTEGER,
    p_user_id INTEGER,
    p_amount_currency1 NUMERIC(18,2),
    p_amount_currency2 NUMERIC(18,2),
    p_cost_price NUMERIC(18,6),
    p_margin NUMERIC(8,4),
    p_client_price NUMERIC(18,6),
    p_start_date DATE,
    p_register_date TIMESTAMP,
    p_value_date DATE,
    p_payment_method_currency1 VARCHAR(30),
    p_payment_method_currency2 VARCHAR(30),
    p_operation_side VARCHAR(10),
    p_base_currency_id INTEGER,
    p_quote_currency_id INTEGER,
    p_origin_id INTEGER,
    p_segment_id INTEGER,
    p_destination_system_id INTEGER,
    p_source_system_id INTEGER,
    p_comments TEXT,
    p_trading_folder_id INTEGER,
    p_sales_folder_id INTEGER,
    p_status_id INTEGER,
    p_modified_by INTEGER
) RETURNS fx_operation_spot AS $$
DECLARE
    updated_fx_operation_spot fx_operation_spot;
BEGIN
    UPDATE fx_operation_spot SET
        client_id = p_client_id,
        user_id = p_user_id,
        amount_currency1 = p_amount_currency1,
        amount_currency2 = p_amount_currency2,
        cost_price = p_cost_price,
        margin = p_margin,
        client_price = p_client_price,
        start_date = p_start_date,
        register_date = p_register_date,
        value_date = p_value_date,
        payment_method_currency1 = p_payment_method_currency1,
        payment_method_currency2 = p_payment_method_currency2,
        operation_side = p_operation_side,
        base_currency_id = p_base_currency_id,
        quote_currency_id = p_quote_currency_id,
        origin_id = p_origin_id,
        segment_id = p_segment_id,
        destination_system_id = p_destination_system_id,
        source_system_id = p_source_system_id,
        comments = p_comments,
        trading_folder_id = p_trading_folder_id,
        sales_folder_id = p_sales_folder_id,
        status_id = p_status_id,
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id
    RETURNING * INTO updated_fx_operation_spot;
    RETURN updated_fx_operation_spot;
END;
$$ LANGUAGE plpgsql;
