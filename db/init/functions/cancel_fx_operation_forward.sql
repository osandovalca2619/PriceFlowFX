CREATE OR REPLACE FUNCTION cancel_fx_operation_forward(
    p_id INTEGER,
    p_cancelled_by INTEGER
) RETURNS VOID AS $$
DECLARE
    op fx_operation_forward%ROWTYPE;
BEGIN
    SELECT * INTO op FROM fx_operation_forward WHERE id = p_id;

    UPDATE fx_operation_forward SET
        status_id = 3, -- 3 = 'anulada'
        cancelled_by = p_cancelled_by,
        cancelled_at = NOW()
    WHERE id = p_id;

    INSERT INTO fx_operation_forward_event (
        fx_operation_forward_id, event_type_id, event_user_id,
        client_id, user_id, amount_currency1, amount_currency2, cost_price, margin, client_price,
        start_date, value_date, payment_method_currency1, payment_method_currency2, operation_side,
        base_currency_id, quote_currency_id, currency_pair_code, origin_id, segment_id,
        destination_system_id, source_system_id, comments, trading_folder_id, sales_folder_id,
        status_id, forward_expiry_date, fixing_date, info_source, reference_index, settlement_type,
        has_split, split_currency_pair, split_amount, settlement_currency_id, tenor_days,
        cost_price_usd, client_price_usd, forward_points, forward_margin, client_price_spot, client_price_forward,
        cancelled_by, cancelled_at
    ) VALUES (
        p_id, 3, p_cancelled_by, -- 3 = 'anulacion'
        op.client_id, op.user_id, op.amount_currency1, op.amount_currency2, op.cost_price, op.margin, op.client_price,
        op.start_date, op.value_date, op.payment_method_currency1, op.payment_method_currency2, op.operation_side,
        op.base_currency_id, op.quote_currency_id, op.currency_pair_code, op.origin_id, op.segment_id,
        op.destination_system_id, op.source_system_id, op.comments, op.trading_folder_id, op.sales_folder_id,
        3, op.forward_expiry_date, op.fixing_date, op.info_source, op.reference_index, op.settlement_type,
        op.has_split, op.split_currency_pair, op.split_amount, op.settlement_currency_id, op.tenor_days,
        op.cost_price_usd, op.client_price_usd, op.forward_points, op.forward_margin, op.client_price_spot, op.client_price_forward,
        p_cancelled_by, NOW()
    );
END;
$$ LANGUAGE plpgsql;