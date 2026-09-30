# SETMIO PADEL PRO — Plataforma SaaS Multi-Tenant de Marca Blanca

Plataforma SaaS multiempresa de marca blanca de alto rendimiento diseñada específicamente para el ecosistema del pádel (clubes deportivos, academias, entrenadores, organizadores de torneos y tiendas oficiales).

---

## 1. Visión y Áreas del Sistema

Una única base de código modular que gestiona todo el ecosistema con aislamiento por tenant:

1. **Web Pública Multipágina del Tenant** (ej: *Centro de Pádel San Mateo*, Narón, Galicia):
   - Inicio deportivo de alto impacto, El Club & Instalaciones, Pistas, Reserva interactiva con Split Payment, Partidos Abiertos "Play!", Escuela de Pádel & Entrenadores Nacionales, Torneos oficiales con cuadros/brackets eliminatorios, Tienda online con carrito y cupones, Blog técnico y Contacto/FAQ.
2. **Aplicación Privada de Gestión (Mobile-Native)** (`/gestion`):
   - Diseñada como una app nativa con barra inferior fija en móvil (`Inicio`, `Agenda`, `Clientes`, `Negocio`, `Más`) y sidebar adaptable en escritorio.
   - Cuadrante interactivo de pistas en tiempo real con conmutación de iluminación LED, gestión de socios, escuela, torneos, inventario de tienda, editor visual y automatización IoT.
3. **Área Privada del Jugador / Socio** (`/app`):
   - Próxima reserva con código PIN de cerradura, partidos jugados, evolución de nivel FEP, seguimiento de habilidades y entrenador personal de IA.
4. **SETMIO HQ (Superadministración)**:
   - Panel exclusivo para el propietario de la plataforma Setmio: MRR global, control y aprovisionamiento de tenants, configuración de planes (FREE, STARTER, PRO, ELITE), auditoría y dominios.
5. **Servicios Compartidos**:
   - PostgreSQL relacional con Row Level Security (RLS) en Supabase, PWA instalable con Service Worker y soporte offline, agente flotante draggable contextual y widget de WhatsApp.

---

## 2. Pila Tecnológica & Despliegue

- **Frontend & App Core**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Motion.
- **Base de Datos & Backend**: PostgreSQL 15+ en **Supabase** con políticas Row Level Security (RLS) multi-tenant (`/supabase/schema.sql`).
- **Control de Versiones**: **GitHub** (código modular sin secretos expuestos).
- **Despliegue y Enrutamiento Multi-Dominio**: **Vercel**.
- **PWA**: Web App Manifest (`/public/manifest.webmanifest`), Service Worker (`/public/sw.js`), iconos adaptables y banner nativo de instalación.

---

## 3. Despliegue en Vercel & Supabase

### Paso A: Base de Datos en Supabase
1. Crea un proyecto en [Supabase](https://supabase.com).
2. Dirígete a la sección **SQL Editor**.
3. Copia el contenido del archivo `supabase/schema.sql` y ejecútalo. Este script:
   - Crea las más de 60 tablas relacionales (`tenants`, `tenant_domains`, `courts`, `bookings`, `open_matches`, `coaches`, `tournaments`, `products`, etc.).
   - Aplica las restricciones de integridad y previene dobles reservas horarias.
   - Habilita RLS (Row Level Security) y genera las políticas de aislamiento para que cada club solo acceda a sus datos.

### Paso B: Conexión en Vercel
1. Conecta tu repositorio de GitHub a tu cuenta de Vercel.
2. Añade las siguientes **Environment Variables** en el panel de Vercel:
   ```bash
   VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
   VITE_SETMIO_ROOT_DOMAIN="setmio.com"
   ```
3. Pulsa **Deploy**.

---

## 4. Configuración de Dominios (Multi-Domain Routing)

La plataforma utiliza la arquitectura de dominios de Vercel para resolver dinámicamente el club:

### 1. Subdominios Automáticos Setmio:
- En tu DNS de `setmio.com`, añade un registro wildcard:
  - **Tipo**: `CNAME`
  - **Host**: `*`
  - **Valor**: `cname.vercel-dns.com`
- Cualquier petición a `sanmateo.setmio.com` resolverá automáticamente el tenant con slug `sanmateo`.

### 2. Dominios Personalizados Propios (ej. `padelsanmateo.es`):
El cliente puede conectar su propio dominio desde la sección **"Mi Web y Mi App"**:
1. Añade el dominio en el asistente.
2. En el registrador DNS del cliente, crea un registro:
   - **Tipo**: `CNAME`
   - **Host**: `@` o `www`
   - **Valor**: `cname.vercel-dns.com`
3. Haz clic en **"Verificar DNS Ahora"**. Vercel emitirá el certificado SSL automático.

---

## 5. Modo Demostración & Cuentas

Para probar la plataforma sin necesidad de configurar credenciales reales, utiliza el **Platform Controller** situado en la barra superior (`TopBarDemo`):

- **Tenant de Demostración**: *Centro de Pádel San Mateo* (Narón, Galicia · Plan ELITE).
- **Perfiles de Simulación de Roles**:
  - `SUPERADMIN`: Control total de Setmio HQ.
  - `TENANT_OWNER`: Propietario del club (Mateo Varela).
  - `TENANT_ADMIN`: Gerente operativo.
  - `RECEPTION`: Recepción y gestión rápida de pistas.
  - `COACH`: Entrenador de academia.
  - `PLAYER`: Jugador socio (Carlos Méndez).
  - `STORE_MANAGER`: Responsable de pro shop e inventario.
  - `TOURNAMENT_ORGANIZER`: Organizador de torneos y cuadros.
