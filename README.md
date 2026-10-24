# PAMCE · Frontend

Interfaz web del sistema **PAMCE** (Premio Anual al Mérito Científico y Empresarial), proyecto de grado del Programa de Ingeniería de Sistemas de la Universidad Francisco de Paula Santander.

Necesita el [backend de PAMCE](https://github.com/ZarayCortez12/BACKEND-PAMCE) en ejecución.

## Tecnologías

- React 18 y Vite
- Redux Toolkit (un `slice` y un `service` por funcionalidad, en `src/features/`)
- Ant Design (en español), Tailwind CSS y framer-motion
- React Router 7
- Firebase Auth (inicio de sesión con Google)

## Instalación

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` como `.env` e indica la URL del backend:

   ```
   VITE_API_URL=http://localhost:4000
   ```

   Si la omites, se usa `http://localhost:4000`.

3. Inicia la aplicación:

   ```bash
   npm run dev       # desarrollo en http://localhost:5173
   npm run build     # compilación para producción (carpeta dist/)
   ```

## Sesión y roles

- La sesión se guarda en cookies `httpOnly` que crea el backend. El frontend nunca guarda tokens en `localStorage`.
- `PrivateRoute` permite entrar a cada sección solo con el **rol activo** correspondiente: administrador, director, jurado o participante. El backend aplica la misma regla en cada ruta.
- Tres minutos antes de que venza la sesión aparece un aviso para extenderla.

## Rutas principales

| Ruta | Quién |
|---|---|
| `/`, `/inicio_sesion`, `/inscripcion-edicion/:token` | Público (página de inicio, login, inscripción por invitación) |
| `/administrador/...` | Gestión de usuarios y auditoría |
| `/director/...` | Ediciones, convocatoria, categorías, rúbricas, postulaciones, jurados, ganadores y reportes |
| `/jurado/...` | Evaluaciones asignadas |
| `/participante/...` | Participaciones, requisitos, resultados y certificado |

## Docker

La URL del backend queda incluida en el build:

```bash
docker build --build-arg VITE_API_URL=https://api.ejemplo.com -t pamce-frontend .
docker run -p 80:80 pamce-frontend
```

`nginx.conf` sirve la aplicación y redirige todas las rutas a `index.html`.

## Estructura

```
src/
├── App.jsx, main.jsx    Rutas y punto de entrada (idioma español)
├── app/                 Store de Redux y rutas protegidas
├── features/            slice + service por funcionalidad
├── pages/               Páginas por rol (ADMINISTRADOR, DIRECTOR, JURADO, PARTICIPANTE)
├── components/          Componentes compartidos
├── utils/               URL del backend, Firebase, menú y sesión
└── styles/, images/
```
