-- Para alertas y notificaciones del sistema
CREATE TABLE notification_config (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES app_user(id),
    event_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL,            -- 'email', 'sms', 'push', 'system'
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);