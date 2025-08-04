# PriceFlowFX - Análisis del Sistema de Base de Datos

## 🎯 **Propósito del Sistema**

**PriceFlowFX** es una plataforma integral de trading de divisas (Foreign Exchange) que gestiona operaciones **Spot** y **Forward** con las siguientes capacidades principales:

- **Trading de divisas** con precios BID/MID/OFFER
- **Gestión de clientes** segmentados por tipo de negocio
- **Operaciones Spot y Forward** con auditoría completa
- **Integración con sistemas externos** (Bloomberg, Reuters, Datatec)
- **Gestión de spreads** dinámicos por segmento y escenario de mercado
- **Control de usuarios** con perfiles y grupos de ventas
- **Auditoría completa** de todas las transacciones

## 🏗️ **Arquitectura del Sistema**

### **Módulos Principales:**

#### 1. **Módulo de Usuarios y Seguridad**
- `app_user` - Usuarios del sistema
- `user_profile` - Perfiles de acceso
- `sales_group` - Grupos de ventas
- `app_parameter` - Configuración del sistema

#### 2. **Módulo de Clientes**
- `client` - Clientes de la plataforma
- `segment` - Segmentación de clientes (retail, corporate)
- `client_external_id` - Integración con sistemas externos
- `app_user_external_id` - IDs externos de usuarios

#### 3. **Módulo de Divisas y Geolocalización**
- `currency` - Catálogo de divisas
- `country` - Países
- `currency_country` - Relación divisas-países
- `holiday` - Feriados por país

#### 4. **Módulo de Trading FX**
- `fx_operation_spot` - Operaciones al contado
- `fx_operation_forward` - Operaciones a plazo
- `fx_operation_status` - Estados de operaciones
- `fx_product` - Productos FX (Spot, Forward)
- `quote_origin` - Origen de cotizaciones

#### 5. **Módulo de Precios y Spreads**
- `fx_price` - Precios históricos por divisa
- `sales_spread` - Spreads de venta por segmento
- `trading_spread_range` - Rangos de spread por monto
- `market_scenario` - Escenarios de mercado

#### 6. **Módulo de Auditoría y Eventos**
- `fx_operation_spot_event` - Eventos de operaciones Spot
- `fx_operation_forward_event` - Eventos de operaciones Forward
- `fx_operation_event_type` - Tipos de eventos
- `operation_folder` - Organización de operaciones

## 🔄 **Flujo de Operaciones**

### **Proceso de Trading:**
1. **Cliente** se registra y es asignado a un **segmento**
2. **Usuario** del sistema cotiza precios basados en **spreads** configurados
3. Se crea una **operación FX** (Spot o Forward)
4. La operación pasa por diferentes **estados** (pendiente → completa → etc.)
5. Todos los cambios se auditan en tablas de **eventos**

### **Gestión de Precios:**
1. Se reciben precios de **fuentes externas** (Bloomberg, Reuters)
2. Se almacenan en `fx_price` con valores BID/MID/OFFER
3. Se aplican **spreads** según cliente, producto y escenario de mercado
4. Se calculan precios finales para el cliente

## 🎨 **Características Técnicas**

### **Patrones de Diseño Implementados:**
- ✅ **Event Sourcing** - Todas las operaciones tienen historial completo
- ✅ **Soft Delete** - Inactivación en lugar de eliminación física
- ✅ **Auditoría Completa** - created_by, modified_by en todas las tablas
- ✅ **External System Integration** - Mapeo de IDs externos
- ✅ **Temporal Data** - Gestión de fechas de operación y liquidación
- ✅ **Business Rules** - Constraints para validar lógica de negocio

### **Escalabilidad y Performance:**
- ✅ **Índices optimizados** en todas las tablas principales
- ✅ **Particionamiento natural** por fechas y tipos de operación
- ✅ **Normalización adecuada** sin redundancia de datos
- ✅ **Triggers para auditoría** automatizada

## 📊 **Métricas del Sistema**

- **24 Tablas principales**
- **+100 campos** de datos especializados en FX
- **Soporte multi-divisa** con 3+ sistemas de precios
- **Auditoría completa** de todas las transacciones
- **Integración** con sistemas externos múltiples

## 🚀 **Casos de Uso Principales**

1. **Trading Spot**: Compra/venta inmediata de divisas
2. **Trading Forward**: Operaciones a futuro con fecha fija
3. **Gestión de Spreads**: Configuración dinámica de márgenes
4. **Reporting**: Análisis de operaciones y rentabilidad
5. **Compliance**: Auditoría y trazabilidad completa
6. **Integración**: Sincronización con proveedores de datos