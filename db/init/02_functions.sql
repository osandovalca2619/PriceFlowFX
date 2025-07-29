-- 1. Registrar operación Spot y evento
CREATE OR REPLACE FUNCTION register_fx_operation_spot(
    p_client_id INTEGER,
    p_user_id INTEGER,
    p_amount_currency1 NUMERIC,
    p_amount_currency2 NUMERIC,
    p_cost_price NUMERIC,
    p_margin NUMERIC,
    p_client_price NUMERIC,
    p_start_date DATE,
    p_value_date DATE,
    p_payment_method_currency1 VARCHAR,
    p_payment_method_currency2 VARCHAR,
    p_operation_side VARCHAR,
    p_base_currency_id INTEGER,
    p_quote_currency_id INTEGER,
    p_currency_pair_code VARCHAR,
    p_origin_id INTEGER,
    p_segment_id INTEGER,
    p_destination_system_id INTEGER,
    p_source_system_id INTEGER,
    p_comments TEXT,
    p_trading_folder_id INTEGER,
    p_sales_folder_id INTEGER,
    p_status_id INTEGER,
    p_created_by INTEGER
) RETURNS INTEGER AS $$
DECLARE
    v_id INTEGER;
BEGIN
    INSERT INTO fx_operation_spot (
        client_id, user_id, amount_currency1, amount_currency2, cost_price, margin, client_price,
        start_date, value_date, payment_method_currency1, payment_method_currency2, operation_side,
        base_currency_id, quote_currency_id, currency_pair_code, origin_id, segment_id,
        destination_system_id, source_system_id, comments, trading_folder_id, sales_folder_id,
        status_id, created_by
    ) VALUES (
        p_client_id, p_user_id, p_amount_currency1, p_amount_currency2, p_cost_price, p_margin, p_client_price,
        p_start_date, p_value_date, p_payment_method_currency1, p_payment_method_currency2, p_operation_side,
        p_base_currency_id, p_quote_currency_id, p_currency_pair_code, p_origin_id, p_segment_id,
        p_destination_system_id, p_source_system_id, p_comments, p_trading_folder_id, p_sales_folder_id,
        p_status_id, p_created_by
    ) RETURNING id INTO v_id;

    INSERT INTO fx_operation_spot_event (
        fx_operation_spot_id, event_type_id, event_user_id,
        client_id, user_id, amount_currency1, amount_currency2, cost_price, margin, client_price,
        start_date, value_date, payment_method_currency1, payment_method_currency2, operation_side,
        base_currency_id, quote_currency_id, currency_pair_code, origin_id, segment_id,
        destination_system_id, source_system_id, comments, trading_folder_id, sales_folder_id,
        status_id, created_by, created_at
    ) VALUES (
        v_id, 1, p_created_by, -- 1 = 'creacion'
        p_client_id, p_user_id, p_amount_currency1, p_amount_currency2, p_cost_price, p_margin, p_client_price,
        p_start_date, p_value_date, p_payment_method_currency1, p_payment_method_currency2, p_operation_side,
        p_base_currency_id, p_quote_currency_id, p_currency_pair_code, p_origin_id, p_segment_id,
        p_destination_system_id, p_source_system_id, p_comments, p_trading_folder_id, p_sales_folder_id,
        p_status_id, p_created_by, NOW()
    );

    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Modificar operación Spot y registrar evento
CREATE OR REPLACE FUNCTION update_fx_operation_spot(
    p_id INTEGER,
    -- (los mismos parámetros que en el insert, más el id y el usuario que modifica)
    p_client_id INTEGER,
    p_user_id INTEGER,
    p_amount_currency1 NUMERIC,
    p_amount_currency2 NUMERIC,
    p_cost_price NUMERIC,
    p_margin NUMERIC,
    p_client_price NUMERIC,
    p_start_date DATE,
    p_value_date DATE,
    p_payment_method_currency1 VARCHAR,
    p_payment_method_currency2 VARCHAR,
    p_operation_side VARCHAR,
    p_base_currency_id INTEGER,
    p_quote_currency_id INTEGER,
    p_currency_pair_code VARCHAR,
    p_origin_id INTEGER,
    p_segment_id INTEGER,
    p_destination_system_id INTEGER,
    p_source_system_id INTEGER,
    p_comments TEXT,
    p_trading_folder_id INTEGER,
    p_sales_folder_id INTEGER,
    p_status_id INTEGER,
    p_modified_by INTEGER
) RETURNS VOID AS $$
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
        value_date = p_value_date,
        payment_method_currency1 = p_payment_method_currency1,
        payment_method_currency2 = p_payment_method_currency2,
        operation_side = p_operation_side,
        base_currency_id = p_base_currency_id,
        quote_currency_id = p_quote_currency_id,
        currency_pair_code = p_currency_pair_code,
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
    WHERE id = p_id;

    -- Registrar evento de modificación (2 = 'modificacion')
    INSERT INTO fx_operation_spot_event (
        fx_operation_spot_id, event_type_id, event_user_id,
        client_id, user_id, amount_currency1, amount_currency2, cost_price, margin, client_price,
        start_date, value_date, payment_method_currency1, payment_method_currency2, operation_side,
        base_currency_id, quote_currency_id, currency_pair_code, origin_id, segment_id,
        destination_system_id, source_system_id, comments, trading_folder_id, sales_folder_id,
        status_id, modified_by, modified_at
    ) VALUES (
        p_id, 2, p_modified_by, -- 2 = 'modificacion'
        p_client_id, p_user_id, p_amount_currency1, p_amount_currency2, p_cost_price, p_margin, p_client_price,
        p_start_date, p_value_date, p_payment_method_currency1, p_payment_method_currency2, p_operation_side,
        p_base_currency_id, p_quote_currency_id, p_currency_pair_code, p_origin_id, p_segment_id,
        p_destination_system_id, p_source_system_id, p_comments, p_trading_folder_id, p_sales_folder_id,
        p_status_id, p_modified_by, NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- 3. Anular operación Spot y registrar evento
CREATE OR REPLACE FUNCTION cancel_fx_operation_spot(
    p_id INTEGER,
    p_cancelled_by INTEGER
) RETURNS VOID AS $$
DECLARE
    op fx_operation_spot%ROWTYPE;
BEGIN
    SELECT * INTO op FROM fx_operation_spot WHERE id = p_id;

    UPDATE fx_operation_spot SET
        status_id = 3, -- 3 = 'anulada'
        cancelled_by = p_cancelled_by,
        cancelled_at = NOW()
    WHERE id = p_id;

    -- Registrar evento de anulación (3 = 'anulacion')
    INSERT INTO fx_operation_spot_event (
        fx_operation_spot_id, event_type_id, event_user_id,
        client_id, user_id, amount_currency1, amount_currency2, cost_price, margin, client_price,
        start_date, value_date, payment_method_currency1, payment_method_currency2, operation_side,
        base_currency_id, quote_currency_id, currency_pair_code, origin_id, segment_id,
        destination_system_id, source_system_id, comments, trading_folder_id, sales_folder_id,
        status_id, cancelled_by, cancelled_at
    ) VALUES (
        p_id, 3, p_cancelled_by, -- 3 = 'anulacion'
        op.client_id, op.user_id, op.amount_currency1, op.amount_currency2, op.cost_price, op.margin, op.client_price,
        op.start_date, op.value_date, op.payment_method_currency1, op.payment_method_currency2, op.operation_side,
        op.base_currency_id, op.quote_currency_id, op.currency_pair_code, op.origin_id, op.segment_id,
        op.destination_system_id, op.source_system_id, op.comments, op.trading_folder_id, op.sales_folder_id,
        3, p_cancelled_by, NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- 4. Registrar operación Forward y evento
CREATE OR REPLACE FUNCTION register_fx_operation_forward(
    p_client_id INTEGER,
    p_user_id INTEGER,
    p_amount_currency1 NUMERIC,
    p_amount_currency2 NUMERIC,
    p_cost_price NUMERIC,
    p_margin NUMERIC,
    p_client_price NUMERIC,
    p_start_date DATE,
    p_value_date DATE,
    p_payment_method_currency1 VARCHAR,
    p_payment_method_currency2 VARCHAR,
    p_operation_side VARCHAR,
    p_base_currency_id INTEGER,
    p_quote_currency_id INTEGER,
    p_currency_pair_code VARCHAR,
    p_origin_id INTEGER,
    p_segment_id INTEGER,
    p_destination_system_id INTEGER,
    p_source_system_id INTEGER,
    p_comments TEXT,
    p_trading_folder_id INTEGER,
    p_sales_folder_id INTEGER,
    p_status_id INTEGER,
    -- Campos específicos de Forward:
    p_forward_expiry_date DATE,
    p_fixing_date DATE,
    p_info_source VARCHAR,
    p_reference_index VARCHAR,
    p_settlement_type VARCHAR,
    p_has_split BOOLEAN,
    p_split_currency_pair VARCHAR,
    p_split_amount NUMERIC,
    p_settlement_currency_id INTEGER,
    p_tenor_days INTEGER,
    p_cost_price_usd NUMERIC,
    p_client_price_usd NUMERIC,
    p_forward_points NUMERIC,
    p_forward_margin NUMERIC,
    p_client_price_spot NUMERIC,
    p_client_price_forward NUMERIC,
    p_created_by INTEGER
) RETURNS INTEGER AS $$
DECLARE
    v_id INTEGER;
BEGIN
    INSERT INTO fx_operation_forward (
        client_id, user_id, amount_currency1, amount_currency2, cost_price, margin, client_price,
        start_date, value_date, payment_method_currency1, payment_method_currency2, operation_side,
        base_currency_id, quote_currency_id, currency_pair_code, origin_id, segment_id,
        destination_system_id, source_system_id, comments, trading_folder_id, sales_folder_id,
        status_id, forward_expiry_date, fixing_date, info_source, reference_index, settlement_type,
        has_split, split_currency_pair, split_amount, settlement_currency_id, tenor_days,
        cost_price_usd, client_price_usd, forward_points, forward_margin, client_price_spot, client_price_forward,
        created_by
    ) VALUES (
        p_client_id, p_user_id, p_amount_currency1, p_amount_currency2, p_cost_price, p_margin, p_client_price,
        p_start_date, p_value_date, p_payment_method_currency1, p_payment_method_currency2, p_operation_side,
        p_base_currency_id, p_quote_currency_id, p_currency_pair_code, p_origin_id, p_segment_id,
        p_destination_system_id, p_source_system_id, p_comments, p_trading_folder_id, p_sales_folder_id,
        p_status_id, p_forward_expiry_date, p_fixing_date, p_info_source, p_reference_index, p_settlement_type,
        p_has_split, p_split_currency_pair, p_split_amount, p_settlement_currency_id, p_tenor_days,
        p_cost_price_usd, p_client_price_usd, p_forward_points, p_forward_margin, p_client_price_spot, p_client_price_forward,
        p_created_by
    ) RETURNING id INTO v_id;

    INSERT INTO fx_operation_forward_event (
        fx_operation_forward_id, event_type_id, event_user_id,
        client_id, user_id, amount_currency1, amount_currency2, cost_price, margin, client_price,
        start_date, value_date, payment_method_currency1, payment_method_currency2, operation_side,
        base_currency_id, quote_currency_id, currency_pair_code, origin_id, segment_id,
        destination_system_id, source_system_id, comments, trading_folder_id, sales_folder_id,
        status_id, forward_expiry_date, fixing_date, info_source, reference_index, settlement_type,
        has_split, split_currency_pair, split_amount, settlement_currency_id, tenor_days,
        cost_price_usd, client_price_usd, forward_points, forward_margin, client_price_spot, client_price_forward,
        created_by, created_at
    ) VALUES (
        v_id, 1, p_created_by, -- 1 = 'creacion'
        p_client_id, p_user_id, p_amount_currency1, p_amount_currency2, p_cost_price, p_margin, p_client_price,
        p_start_date, p_value_date, p_payment_method_currency1, p_payment_method_currency2, p_operation_side,
        p_base_currency_id, p_quote_currency_id, p_currency_pair_code, p_origin_id, p_segment_id,
        p_destination_system_id, p_source_system_id, p_comments, p_trading_folder_id, p_sales_folder_id,
        p_status_id, p_forward_expiry_date, p_fixing_date, p_info_source, p_reference_index, p_settlement_type,
        p_has_split, p_split_currency_pair, p_split_amount, p_settlement_currency_id, p_tenor_days,
        p_cost_price_usd, p_client_price_usd, p_forward_points, p_forward_margin, p_client_price_spot, p_client_price_forward,
        p_created_by, NOW()
    );

    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Modificar operación Forward y registrar evento
CREATE OR REPLACE FUNCTION update_fx_operation_forward(
    p_id INTEGER,
    p_client_id INTEGER,
    p_user_id INTEGER,
    p_amount_currency1 NUMERIC,
    p_amount_currency2 NUMERIC,
    p_cost_price NUMERIC,
    p_margin NUMERIC,
    p_client_price NUMERIC,
    p_start_date DATE,
    p_value_date DATE,
    p_payment_method_currency1 VARCHAR,
    p_payment_method_currency2 VARCHAR,
    p_operation_side VARCHAR,
    p_base_currency_id INTEGER,
    p_quote_currency_id INTEGER,
    p_currency_pair_code VARCHAR,
    p_origin_id INTEGER,
    p_segment_id INTEGER,
    p_destination_system_id INTEGER,
    p_source_system_id INTEGER,
    p_comments TEXT,
    p_trading_folder_id INTEGER,
    p_sales_folder_id INTEGER,
    p_status_id INTEGER,
    -- Campos específicos de Forward:
    p_forward_expiry_date DATE,
    p_fixing_date DATE,
    p_info_source VARCHAR,
    p_reference_index VARCHAR,
    p_settlement_type VARCHAR,
    p_has_split BOOLEAN,
    p_split_currency_pair VARCHAR,
    p_split_amount NUMERIC,
    p_settlement_currency_id INTEGER,
    p_tenor_days INTEGER,
    p_cost_price_usd NUMERIC,
    p_client_price_usd NUMERIC,
    p_forward_points NUMERIC,
    p_forward_margin NUMERIC,
    p_client_price_spot NUMERIC,
    p_client_price_forward NUMERIC,
    p_modified_by INTEGER
) RETURNS VOID AS $$
BEGIN
    UPDATE fx_operation_forward SET
        client_id = p_client_id,
        user_id = p_user_id,
        amount_currency1 = p_amount_currency1,
        amount_currency2 = p_amount_currency2,
        cost_price = p_cost_price,
        margin = p_margin,
        client_price = p_client_price,
        start_date = p_start_date,
        value_date = p_value_date,
        payment_method_currency1 = p_payment_method_currency1,
        payment_method_currency2 = p_payment_method_currency2,
        operation_side = p_operation_side,
        base_currency_id = p_base_currency_id,
        quote_currency_id = p_quote_currency_id,
        currency_pair_code = p_currency_pair_code,
        origin_id = p_origin_id,
        segment_id = p_segment_id,
        destination_system_id = p_destination_system_id,
        source_system_id = p_source_system_id,
        comments = p_comments,
        trading_folder_id = p_trading_folder_id,
        sales_folder_id = p_sales_folder_id,
        status_id = p_status_id,
        forward_expiry_date = p_forward_expiry_date,
        fixing_date = p_fixing_date,
        info_source = p_info_source,
        reference_index = p_reference_index,
        settlement_type = p_settlement_type,
        has_split = p_has_split,
        split_currency_pair = p_split_currency_pair,
        split_amount = p_split_amount,
        settlement_currency_id = p_settlement_currency_id,
        tenor_days = p_tenor_days,
        cost_price_usd = p_cost_price_usd,
        client_price_usd = p_client_price_usd,
        forward_points = p_forward_points,
        forward_margin = p_forward_margin,
        client_price_spot = p_client_price_spot,
        client_price_forward = p_client_price_forward,
        modified_by = p_modified_by,
        modified_at = NOW()
    WHERE id = p_id;

    -- Registrar evento de modificación (2 = 'modificacion')
    INSERT INTO fx_operation_forward_event (
        fx_operation_forward_id, event_type_id, event_user_id,
        client_id, user_id, amount_currency1, amount_currency2, cost_price, margin, client_price,
        start_date, value_date, payment_method_currency1, payment_method_currency2, operation_side,
        base_currency_id, quote_currency_id, currency_pair_code, origin_id, segment_id,
        destination_system_id, source_system_id, comments, trading_folder_id, sales_folder_id,
        status_id, forward_expiry_date, fixing_date, info_source, reference_index, settlement_type,
        has_split, split_currency_pair, split_amount, settlement_currency_id, tenor_days,
        cost_price_usd, client_price_usd, forward_points, forward_margin, client_price_spot, client_price_forward,
        modified_by, modified_at
    ) VALUES (
        p_id, 2, p_modified_by, -- 2 = 'modificacion'
        p_client_id, p_user_id, p_amount_currency1, p_amount_currency2, p_cost_price, p_margin, p_client_price,
        p_start_date, p_value_date, p_payment_method_currency1, p_payment_method_currency2, p_operation_side,
        p_base_currency_id, p_quote_currency_id, p_currency_pair_code, p_origin_id, p_segment_id,
        p_destination_system_id, p_source_system_id, p_comments, p_trading_folder_id, p_sales_folder_id,
        p_status_id, p_forward_expiry_date, p_fixing_date, p_info_source, p_reference_index, p_settlement_type,
        p_has_split, p_split_currency_pair, p_split_amount, p_settlement_currency_id, p_tenor_days,
        p_cost_price_usd, p_client_price_usd, p_forward_points, p_forward_margin, p_client_price_spot, p_client_price_forward,
        p_modified_by, NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- 6. Anular operación Forward y registrar evento
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

    -- Registrar evento de anulación (3 = 'anulacion')
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