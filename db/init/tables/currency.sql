CREATE TABLE currency (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL CHECK (char_length(code) = 3 AND code = upper(code)),
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(5),
    country VARCHAR(50),
    decimals INTEGER NOT NULL DEFAULT 2,
    is_strong_currency BOOLEAN NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_by INTEGER,
    modified_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'activo',    
    FOREIGN KEY (created_by) REFERENCES app_user(id),
    FOREIGN KEY (modified_by) REFERENCES app_user(id)
);

CREATE INDEX idx_currency_name ON currency(name);

CREATE TABLE currency_audit (
    audit_id SERIAL PRIMARY KEY,
    currency_id INTEGER NOT NULL,
    operation VARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_data JSONB,
    new_data JSONB,
    changed_by INTEGER NOT NULL,
    changed_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (currency_id) REFERENCES currency(id),
    FOREIGN KEY (changed_by) REFERENCES app_user(id)
);

-- Función para auditar cambios en currency
CREATE OR REPLACE FUNCTION audit_currency_changes() RETURNS TRIGGER AS $
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO currency_audit(currency_id, operation, old_data, new_data, changed_by)
        VALUES (NEW.id, 'INSERT', NULL, to_jsonb(NEW), NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO currency_audit(currency_id, operation, old_data, new_data, changed_by)
        VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), NEW.modified_by);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO currency_audit(currency_id, operation, old_data, new_data, changed_by)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD), NULL, OLD.modified_by);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$ LANGUAGE plpgsql;

-- Triggers para auditar INSERT, UPDATE y DELETE
CREATE TRIGGER trg_audit_currency_insert
AFTER INSERT ON currency
FOR EACH ROW EXECUTE FUNCTION audit_currency_changes();

CREATE TRIGGER trg_audit_currency_update
AFTER UPDATE ON currency
FOR EACH ROW EXECUTE FUNCTION audit_currency_changes();

CREATE TRIGGER trg_audit_currency_delete
AFTER DELETE ON currency
FOR EACH ROW EXECUTE FUNCTION audit_currency_changes();