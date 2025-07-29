-- Tabla de divisas
CREATE TABLE currency (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,         -- Ej: USD, EUR
    name VARCHAR(50) NOT NULL,
    is_strong_currency BOOLEAN NOT NULL,     -- TRUE si es fuerte vs USD
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de productos FX
CREATE TABLE fx_product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,               -- Ej: Spot, Forward
    description VARCHAR(100)
);

-- Tabla de precios por divisa y producto
CREATE TABLE fx_price (
    id SERIAL PRIMARY KEY,
    currency_id INTEGER REFERENCES currency(id),
    fx_product_id INTEGER REFERENCES fx_product(id),
    price_date DATE NOT NULL,
    price_bid NUMERIC(18,6),         -- Precio BID
    price_mid NUMERIC(18,6),         -- Precio MID
    price_offer NUMERIC(18,6),       -- Precio OFFER
    info_source VARCHAR(50),         -- Origen de la información (ej: Bloomberg, Datatec)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP             -- Fecha/hora de última actualización
);

-- Tabla de escenarios de mercado
CREATE TABLE market_scenario (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,               -- normal, volatile, high volatile
    description VARCHAR(100)
);

-- Tabla de tramos de monto para spread de trading
CREATE TABLE trading_spread_range (
    id SERIAL PRIMARY KEY,
    currency_id INTEGER REFERENCES currency(id),
    scenario_id INTEGER REFERENCES market_scenario(id),
    amount_min NUMERIC(18,2) NOT NULL,
    amount_max NUMERIC(18,2) NOT NULL,
    spread NUMERIC(8,4) NOT NULL,            -- Spread aplicado
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de origen de cotización (ej: web, mesa, app, etc.)
CREATE TABLE quote_origin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Tabla de segmentos (ej: retail, corporate, etc.)
CREATE TABLE segment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Tabla de spread de ventas
CREATE TABLE sales_spread (
    id SERIAL PRIMARY KEY,
    base_currency_id INTEGER REFERENCES currency(id),
    quote_currency_id INTEGER REFERENCES currency(id),
    origin_id INTEGER REFERENCES quote_origin(id),
    segment_id INTEGER REFERENCES segment(id),
    fx_product_id INTEGER REFERENCES fx_product(id),
    market_hours BOOLEAN NOT NULL,           -- TRUE: dentro de horario, FALSE: fuera
    spread_buy NUMERIC(8,4) NOT NULL,        -- Spread para compra
    spread_sell NUMERIC(8,4) NOT NULL,       -- Spread para venta
    created_at TIMESTAMP DEFAULT NOW()
);


-- Tabla principal de operaciones Spot
CREATE TABLE fx_operation_spot (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount_currency1 NUMERIC(18,2) NOT NULL,
    amount_currency2 NUMERIC(18,2) NOT NULL,
    cost_price NUMERIC(18,6) NOT NULL,
    margin NUMERIC(8,4) NOT NULL,
    client_price NUMERIC(18,6) NOT NULL,
    start_date DATE NOT NULL,
    register_date TIMESTAMP DEFAULT NOW(),
    value_date DATE NOT NULL,
    payment_method_currency1 VARCHAR(30),
    payment_method_currency2 VARCHAR(30),
    operation_side VARCHAR(10) NOT NULL, -- 'buy' o 'sell'
    base_currency_id INTEGER REFERENCES currency(id),
    quote_currency_id INTEGER REFERENCES currency(id),
    origin_id INTEGER REFERENCES quote_origin(id),
    segment_id INTEGER REFERENCES segment(id),
    destination_system_id INTEGER,
    source_system_id INTEGER,
    comments TEXT,
    trading_folder_id INTEGER REFERENCES operation_folder(id),
    sales_folder_id INTEGER REFERENCES operation_folder(id),
    status_id INTEGER NOT NULL REFERENCES fx_operation_status(id) DEFAULT 2,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER,
    modified_at TIMESTAMP,
    cancelled_by INTEGER,
    cancelled_at TIMESTAMP
);

-- Tabla principal de operaciones Forward
CREATE TABLE fx_operation_forward (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount_currency1 NUMERIC(18,2) NOT NULL,
    amount_currency2 NUMERIC(18,2) NOT NULL,
    cost_price NUMERIC(18,6) NOT NULL,
    margin NUMERIC(8,4) NOT NULL,
    client_price NUMERIC(18,6) NOT NULL,
    start_date DATE NOT NULL,
    register_date TIMESTAMP DEFAULT NOW(),
    value_date DATE NOT NULL,
    payment_method_currency1 VARCHAR(30),
    payment_method_currency2 VARCHAR(30),
    operation_side VARCHAR(10) NOT NULL, -- 'buy' o 'sell'
    base_currency_id INTEGER REFERENCES currency(id),
    quote_currency_id INTEGER REFERENCES currency(id),
    origin_id INTEGER REFERENCES quote_origin(id),
    segment_id INTEGER REFERENCES segment(id),
    destination_system_id INTEGER,
    source_system_id INTEGER,
    comments TEXT,
    trading_folder_id INTEGER REFERENCES operation_folder(id),
    sales_folder_id INTEGER REFERENCES operation_folder(id),
    status_id INTEGER NOT NULL REFERENCES fx_operation_status(id) DEFAULT 2,
    -- Campos específicos de Forward:
    forward_expiry_date DATE NOT NULL,
    fixing_date DATE,
    info_source VARCHAR(50),
    reference_index VARCHAR(50),
    settlement_type VARCHAR(30),
    has_split BOOLEAN DEFAULT FALSE,
    split_currency_pair VARCHAR(7),
    split_amount NUMERIC(18,2),
    settlement_currency_id INTEGER REFERENCES currency(id), -- Divisa de liquidación
    tenor_days INTEGER,                                    -- Plazo en días
    cost_price_usd NUMERIC(18,6),                          -- Precio costo divisa USD
    client_price_usd NUMERIC(18,6),                        -- Precio cliente divisa USD
    forward_points NUMERIC(18,6),                          -- Puntos forward
    forward_margin NUMERIC(8,4),                           -- Margen forward
    client_price_spot NUMERIC(18,6),                       -- Precio cliente spot
    client_price_forward NUMERIC(18,6),                    -- Precio cliente forward
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER,
    modified_at TIMESTAMP,
    cancelled_by INTEGER,
    cancelled_at TIMESTAMP
);

-- Tabla de estados de operación FX
CREATE TABLE fx_operation_status (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,      -- Ej: 'completa', 'pendiente'
    description VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL
);

-- Ejemplo de inserts iniciales
INSERT INTO fx_operation_status (code, description, display_order) VALUES
('completa', 'Operación completada', 1),
('pendiente', 'Operación pendiente', 2),
('anulada', 'Operación anulada', 3),
('incompleta', 'Operación incompleta', 4),
('pendiente de aprobar', 'Pendiente de aprobación', 5),
('pendiente de anular', 'Pendiente de anulación', 6);

-- Tabla de clientes
CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    client_identifier VARCHAR(50) UNIQUE NOT NULL,   -- Identificador interno propio
    name VARCHAR(100) NOT NULL,
    segment_id INTEGER REFERENCES segment(id),
    status VARCHAR(10) NOT NULL DEFAULT 'activo',
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER,
    modified_at TIMESTAMP,
    inactivated_by INTEGER,
    inactivated_at TIMESTAMP,
    CONSTRAINT client_status_check CHECK (status IN ('activo', 'inactivo'))
);

-- Tabla de identificadores externos de cliente
CREATE TABLE client_external_id (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES client(id),
    origin_system VARCHAR(30) NOT NULL,     -- Ej: 'bloomberg', 'reuters', 'datatec'
    origin_code VARCHAR(50) NOT NULL,       -- Código recibido del sistema externo
    UNIQUE (client_id, origin_system)
);

-- Tabla de países
CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,      -- Ej: 'CL', 'US'
    name VARCHAR(100) NOT NULL
);

-- Relaciona divisas con países (por si una divisa es usada en varios países)
CREATE TABLE currency_country (
    id SERIAL PRIMARY KEY,
    currency_id INTEGER NOT NULL REFERENCES currency(id),
    country_id INTEGER NOT NULL REFERENCES country(id),
    UNIQUE(currency_id, country_id)
);

-- Tabla de feriados por país
CREATE TABLE holiday (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES country(id),
    holiday_date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    UNIQUE(country_id, holiday_date)
);

-- Tabla de folders de operaciones
CREATE TABLE operation_folder (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,         -- Código del folder
    name VARCHAR(100) NOT NULL,               -- Nombre descriptivo
    folder_type VARCHAR(10) NOT NULL,         -- 'trading' o 'sales'
    status VARCHAR(10) NOT NULL DEFAULT 'activo', -- 'activo' o 'inactivo'
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER,
    modified_at TIMESTAMP,
    inactivated_by INTEGER,
    inactivated_at TIMESTAMP,
    CONSTRAINT folder_type_check CHECK (folder_type IN ('trading', 'sales')),
    CONSTRAINT folder_status_check CHECK (status IN ('activo', 'inactivo'))
);

-- Tabla de parámetros de la aplicación
CREATE TABLE app_parameter (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,           -- Código del parámetro
    description VARCHAR(200) NOT NULL,          -- Descripción del parámetro
    value_str1 VARCHAR(100),
    value_str2 VARCHAR(100),
    value_int1 INTEGER,
    value_int2 INTEGER,
    value_dec1 NUMERIC(18,6),
    value_dec2 NUMERIC(18,6),
    status VARCHAR(10) NOT NULL DEFAULT 'activo', -- 'activo' o 'inactivo'
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER,
    modified_at TIMESTAMP,
    inactivated_by INTEGER,
    inactivated_at TIMESTAMP,
    CONSTRAINT app_parameter_status_check CHECK (status IN ('activo', 'inactivo'))
);

-- Tabla de perfiles de usuario (opcional, si quieres normalizar perfiles)
CREATE TABLE user_profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(100)
);

-- Tabla de grupos de venta (opcional, si quieres normalizar grupos)
CREATE TABLE sales_group (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(100)
);

-- Tabla de usuarios
CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    profile_id INTEGER REFERENCES user_profile(id),
    sales_group_id INTEGER REFERENCES sales_group(id),
    status VARCHAR(10) NOT NULL DEFAULT 'activo', -- 'activo' o 'inactivo'
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER,
    modified_at TIMESTAMP,
    inactivated_by INTEGER,
    inactivated_at TIMESTAMP,
    CONSTRAINT app_user_status_check CHECK (status IN ('activo', 'inactivo'))
);

-- Tabla de identificadores externos de usuario
CREATE TABLE app_user_external_id (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES app_user(id),
    origin_system VARCHAR(30) NOT NULL,     -- Ej: 'bloomberg', 'reuters', 'datatec'
    origin_code VARCHAR(50) NOT NULL,       -- Código recibido del sistema externo
    client_id INTEGER REFERENCES client(id),-- Relación con cliente si aplica
    UNIQUE (user_id, origin_system)
);

-- Tabla de eventos para operaciones Spot
CREATE TABLE fx_operation_spot_event (
    id SERIAL PRIMARY KEY,
    fx_operation_spot_id INTEGER NOT NULL REFERENCES fx_operation_spot(id),
    event_type_id INTEGER NOT NULL REFERENCES fx_operation_event_type(id),
    event_timestamp TIMESTAMP DEFAULT NOW(),
    event_user_id INTEGER NOT NULL,

    -- Copia de todos los campos de fx_operation_spot
    client_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount_currency1 NUMERIC(18,2) NOT NULL,
    amount_currency2 NUMERIC(18,2) NOT NULL,
    cost_price NUMERIC(18,6) NOT NULL,
    margin NUMERIC(8,4) NOT NULL,
    client_price NUMERIC(18,6) NOT NULL,
    start_date DATE NOT NULL,
    register_date TIMESTAMP,
    value_date DATE NOT NULL,
    payment_method_currency1 VARCHAR(30),
    payment_method_currency2 VARCHAR(30),
    operation_side VARCHAR(10) NOT NULL,
    base_currency_id INTEGER,
    quote_currency_id INTEGER,
    origin_id INTEGER,
    segment_id INTEGER,
    destination_system_id INTEGER,
    source_system_id INTEGER,
    comments TEXT,
    trading_folder_id INTEGER,
    sales_folder_id INTEGER,
    status_id INTEGER,
    created_by INTEGER,
    created_at TIMESTAMP,
    modified_by INTEGER,
    modified_at TIMESTAMP,
    cancelled_by INTEGER,
    cancelled_at TIMESTAMP
);

-- Tabla de eventos para operaciones Forward
CREATE TABLE fx_operation_forward_event (
    id SERIAL PRIMARY KEY,
    fx_operation_forward_id INTEGER NOT NULL REFERENCES fx_operation_forward(id),
    event_type_id INTEGER NOT NULL REFERENCES fx_operation_event_type(id),
    event_timestamp TIMESTAMP DEFAULT NOW(),
    event_user_id INTEGER NOT NULL,

    -- Copia de todos los campos de fx_operation_forward
    client_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount_currency1 NUMERIC(18,2) NOT NULL,
    amount_currency2 NUMERIC(18,2) NOT NULL,
    cost_price NUMERIC(18,6) NOT NULL,
    margin NUMERIC(8,4) NOT NULL,
    client_price NUMERIC(18,6) NOT NULL,
    start_date DATE NOT NULL,
    register_date TIMESTAMP,
    value_date DATE NOT NULL,
    payment_method_currency1 VARCHAR(30),
    payment_method_currency2 VARCHAR(30),
    operation_side VARCHAR(10) NOT NULL,
    base_currency_id INTEGER,
    quote_currency_id INTEGER,
    origin_id INTEGER,
    segment_id INTEGER,
    destination_system_id INTEGER,
    source_system_id INTEGER,
    comments TEXT,
    trading_folder_id INTEGER,
    sales_folder_id INTEGER,
    status_id INTEGER,
    forward_expiry_date DATE,
    fixing_date DATE,
    info_source VARCHAR(50),
    reference_index VARCHAR(50),
    settlement_type VARCHAR(30),
    has_split BOOLEAN,
    split_currency_pair VARCHAR(7),
    split_amount NUMERIC(18,2),
    settlement_currency_id INTEGER,
    tenor_days INTEGER,
    cost_price_usd NUMERIC(18,6),
    client_price_usd NUMERIC(18,6),
    forward_points NUMERIC(18,6),
    forward_margin NUMERIC(8,4),
    client_price_spot NUMERIC(18,6),
    client_price_forward NUMERIC(18,6),
    created_by INTEGER,
    created_at TIMESTAMP,
    modified_by INTEGER,
    modified_at TIMESTAMP,
    cancelled_by INTEGER,
    cancelled_at TIMESTAMP
);
