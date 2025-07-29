-- Tabla de grupos de venta
-- Catálogo de grupos de venta para segmentación de usuarios
CREATE TABLE sales_group (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(100)
);

CREATE INDEX idx_sales_group_name ON sales_group(name);

COMMENT ON TABLE sales_group IS 'Catálogo de grupos de venta para segmentación de usuarios';
COMMENT ON COLUMN sales_group.name IS 'Nombre único del grupo de venta';
COMMENT ON COLUMN sales_group.description IS 'Descripción del grupo de venta';
