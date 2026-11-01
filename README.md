# 💳 ApiBootcamp2026 - Digital Wallet API

API RESTful para una plataforma de Billetera Virtual (Digital Wallet). Este proyecto está desarrollado utilizando **Node.js, Express, Mongoose (MongoDB) y TypeScript**, siguiendo una arquitectura modular por componentes en capas.

---

## 🏗️ Arquitectura del Proyecto

El backend está organizado de forma modular. Cada dominio de negocio (como `user` o `account`) se encapsula en su propia carpeta y se divide en las siguientes capas de responsabilidad:

*   **Routes (`routes.ts`):** Definición de endpoints HTTP.
*   **Controller (`controller.ts`):** Manejo de peticiones (`req`) y respuestas (`res`), validaciones sintácticas iniciales y control de excepciones.
*   **Service (`service.ts`):** Capa medular donde reside toda la lógica de negocio y las reglas de transacciones financieras.
*   **DAO - Data Access Object (`dao.ts`):** Capa de persistencia exclusiva encargada de interactuar directamente con Mongoose.
*   **Model (`model.ts`):** Esquemas de Mongoose y modelos de MongoDB.
*   **Types (`types.ts`):** Tipado estricto e interfaces de TypeScript nativas de cada componente.

---

## 🛠️ Tecnologías: Node.js • Express • TypeScript • MongoDB • Mongoose • Swagger

---

## ⚙️ Configuración del Entorno

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ramirezaed/ApiBootcamp2026.git
   cd ApiBootcamp2026
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno (`.env`):**
   Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables obligatorias:
   ```env
   DB_URI=tu_conexion_a_mongo_atlas
   TOKEN_SECRET=tu_secreto_para_jwt
   ```

---

## 🚀 Ejecución en Desarrollo

Por defecto, el servidor está configurado para correr en el **puerto 5000**. Para levantar el entorno de desarrollo, ejecuta el siguiente comando:

```bash
npm run server
```

---

## 📄 Documentación con Swagger

El proyecto cuenta con documentación interactiva integrada. Una vez que el servidor esté corriendo, puedes acceder a la interfaz visual de Swagger para probar los endpoints directamente desde el navegador en la siguiente ruta por defecto:

```text
http://localhost:5000/api-docs
```

---

## 🛣️ Endpoints de la API

Todas las rutas del proyecto están prefijadas bajo la siguiente URL base para tus pruebas en Postman:
`http://localhost:5000/api/`

El sistema cuenta con un control de accesos basado en dos roles: **admin** y **user**.

### 👤 Usuarios (`/api/user`)

| Método | Endpoint | Middleware / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | `auth`, `isAdmin` | Lista todos los usuarios registrados (Solo Admins) |
| **POST** | `/` | *Público* | Registra un nuevo usuario en la plataforma |
| **GET** | `/me` | `auth` | Obtiene el perfil del usuario autenticado |
| **PATCH** | `/me/password` | `auth` | Cambia la contraseña del usuario autenticado |
| **PATCH** | `/` | `auth` | Actualiza los datos generales del perfil |
| **DELETE** | `/` | `auth` | Elimina la cuenta del usuario autenticado |
| **POST** | `/auth` | *Público* | Login de usuario. Retorna el Token JWT |

### 💳 Cuentas (`/api/account`)

| Método | Endpoint | Middleware / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | `auth`, `isAdmin` | Lista todas las cuentas del sistema (Solo Admins) |
| **GET** | `/me` | `auth` | Obtiene los detalles y el saldo de la cuenta propia |
| **PATCH** | `/alias` | `auth` | Modifica el alias identificador de la cuenta |
| **PATCH** | `/deposit` | `auth` | Realiza un depósito de dinero en la cuenta |
| **PATCH** | `/transfer` | `auth` | Realiza una transferencia monetaria hacia otra cuenta |

