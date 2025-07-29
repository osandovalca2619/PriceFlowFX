-- Tabla de perfiles de usuario
-- Catálogo de perfiles de usuario para control de acceso y permisos
CREATE TABLE user_profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(100)
);

CREATE INDEX idx_user_profile_name ON user_profile(name);

COMMENT ON TABLE user_profile IS 'Catálogo de perfiles de usuario para control de acceso y permisos';
COMMENT ON COLUMN user_profile.name IS 'Nombre único del perfil de usuario';
COMMENT ON COLUMN user_profile.description IS 'Descripción del perfil de usuario';
