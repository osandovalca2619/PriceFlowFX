# Forex Trading App

Una aplicación web moderna para trading de forex construida con Next.js, React y TypeScript. La aplicación incluye un dashboard completo con funcionalidades de trading, gestión de operaciones y análisis de precios.

## 🚀 Características

- **Dashboard Interactivo**: Panel principal con métricas en tiempo real
- **Sistema de Autenticación**: Login y gestión de sesiones
- **Gestión de Operaciones**: Crear, editar y monitorear operaciones de trading
- **Análisis de Precios**: Visualización de precios y spreads
- **Gestión de Posiciones**: Control de posiciones USD y otras monedas
- **Tema Oscuro/Claro**: Soporte para múltiples temas
- **Responsive Design**: Optimizado para dispositivos móviles y desktop

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Formularios**: React Hook Form con Zod
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Gestión de Estado**: React Hooks
- **Temas**: next-themes

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [pnpm](https://pnpm.io/) (recomendado) o npm
- [Git](https://git-scm.com/)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
# Si aún no has clonado el repositorio principal
git clone <tu-repositorio>
cd proyectoFX/forex-trading-app
```

### 2. Instalar dependencias

#### Opción A: Usando npm (recomendado para Windows)

```bash
npm install --legacy-peer-deps
```

**Nota**: Se usa `--legacy-peer-deps` para resolver conflictos de dependencias entre React 19 y algunas librerías que aún no lo soportan completamente.

#### Opción B: Usando pnpm (si está instalado)

```bash
# Instalar pnpm globalmente (si no lo tienes)
npm install -g pnpm

# Luego instalar dependencias
pnpm install
```

#### Solución de problemas en Windows PowerShell

Si encuentras errores de políticas de ejecución en PowerShell:

1. **Abrir PowerShell como Administrador**
2. **Ejecutar el siguiente comando:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. **Confirmar con "Y" o "S"**
4. **Intentar nuevamente la instalación:**
   ```bash
   npm install
   ```

#### Alternativa: Usar Command Prompt (cmd)

Si PowerShell sigue dando problemas, puedes usar el Command Prompt:
1. Abrir Command Prompt
2. Navegar a la carpeta del proyecto
3. Ejecutar `npm install`

### 3. Configurar variables de entorno (opcional)

Si necesitas configurar variables de entorno específicas, crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Crear archivo de variables de entorno
touch .env.local
```

### 4. Ejecutar la aplicación en modo desarrollo

```bash
# Usando npm (recomendado para Windows)
npm run dev

# O usando pnpm (si está instalado)
pnpm dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 📁 Estructura del Proyecto

```
forex-trading-app/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticación
│   ├── dashboard/        # Componentes del dashboard
│   ├── trading/          # Componentes de trading
│   ├── ui/               # Componentes UI reutilizables
│   └── theme/            # Componentes de temas
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuraciones
├── public/               # Archivos estáticos
├── styles/               # Estilos adicionales
├── package.json          # Dependencias del proyecto
├── next.config.mjs       # Configuración de Next.js
├── tsconfig.json         # Configuración de TypeScript
└── tailwind.config.js    # Configuración de Tailwind CSS
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev       # Inicia el servidor de desarrollo
pnpm dev          # (si pnpm está instalado)

# Construcción
npm run build     # Construye la aplicación para producción
pnpm build        # (si pnpm está instalado)

# Producción
npm run start     # Inicia la aplicación en modo producción
pnpm start        # (si pnpm está instalado)

# Linting
npm run lint      # Ejecuta el linter
pnpm lint         # (si pnpm está instalado)
```

## 🔧 Configuración Adicional

### Configuración de TypeScript

El proyecto está configurado con TypeScript estricto. Los errores de TypeScript se ignoran durante el build para facilitar el desarrollo, pero se recomienda corregirlos antes de hacer deploy.

### Configuración de Tailwind CSS

El proyecto utiliza Tailwind CSS v4 con configuración personalizada. Los estilos se pueden modificar en:
- `app/globals.css` - Estilos globales
- `tailwind.config.js` - Configuración de Tailwind

### Componentes UI

La aplicación utiliza Radix UI como base para los componentes. Todos los componentes están personalizados con Tailwind CSS y se encuentran en `components/ui/`.

## 🌐 Acceso a la Aplicación

Una vez que la aplicación esté ejecutándose:

1. Abre tu navegador
2. Ve a **http://localhost:3000**
3. Verás la pantalla de login
4. Inicia sesión para acceder al dashboard principal

## 🔍 Funcionalidades Principales

### Dashboard Principal
- Métricas en tiempo real
- Resumen de operaciones
- Gráficos de precios
- Gestión de posiciones

### Trading
- Crear nuevas operaciones
- Gestionar spreads
- Monitorear posiciones
- Análisis de precios

### Gestión de Operaciones
- Lista de operaciones pendientes
- Historial de operaciones
- Filtros y búsqueda
- Confirmación de operaciones

## 🐛 Solución de Problemas

### Error de puerto ocupado
Si el puerto 3000 está ocupado, puedes cambiar el puerto:

```bash
npm run dev -- --port 3001
# O si usas pnpm:
pnpm dev --port 3001
```

### Error de dependencias
Si hay problemas con las dependencias:

```bash
# Limpiar cache (npm)
npm cache clean --force
rm -rf node_modules
npm install --legacy-peer-deps

# O si usas pnpm:
pnpm store prune
rm -rf node_modules
pnpm install
```

### Error de conflictos de dependencias (React 19)
Si encuentras errores como "ERESOLVE unable to resolve dependency tree":

```bash
# Usar legacy peer deps para resolver conflictos
npm install --legacy-peer-deps
```

### Error de TypeScript
Si hay errores de TypeScript que impiden el desarrollo:

```bash
# Los errores se ignoran durante el build, pero puedes verlos con:
npx tsc --noEmit
# O si usas pnpm:
pnpm tsc --noEmit
```

## 📝 Notas de Desarrollo

- La aplicación utiliza el App Router de Next.js 15
- Los componentes están optimizados para React 19
- Se utiliza pnpm como gestor de paquetes (recomendado)
- Los errores de TypeScript se ignoran durante el build para facilitar el desarrollo

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

¡Disfruta desarrollando tu aplicación de trading de forex! 🚀 