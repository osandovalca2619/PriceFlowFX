-- Tabla de usuarios
-- Almacena los usuarios de la aplicación FX
CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    profile_id INTEGER NOT NULL REFERENCES user_profile(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    sales_group_id INTEGER REFERENCES sales_group(id) ON DELETE SET NULL ON UPDATE CASCADE,
    status VARCHAR(10) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
    created_by INTEGER NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER REFERENCES app_user(id) ON DELETE RESTRICT,
    modified_at TIMESTAMP
);

CREATE INDEX idx_app_user_username ON app_user(username);
CREATE INDEX idx_app_user_status ON app_user(status);
CREATE INDEX idx_app_user_profile_id ON app_user(profile_id);
CREATE INDEX idx_app_user_sales_group_id ON app_user(sales_group_id);

COMMENT ON TABLE app_user IS 'Almacena los usuarios de la aplicación FX';
COMMENT ON COLUMN app_user.username IS 'Nombre de usuario único';
COMMENT ON COLUMN app_user.profile_id IS 'Perfil de usuario (FK a user_profile)';
COMMENT ON COLUMN app_user.sales_group_id IS 'Grupo de venta (FK a sales_group)';
COMMENT ON COLUMN app_user.status IS 'Estado del usuario: activo o inactivo';
COMMENT ON COLUMN app_user.created_by IS 'Usuario que creó el registro';
COMMENT ON COLUMN app_user.modified_by IS 'Usuario que modificó el registro';
