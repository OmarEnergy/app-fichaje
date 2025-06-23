# ODS Fichaje

Aplicación de control de fichajes desarrollada con Node.js, Express y TypeScript. Incluye un ejemplo de autenticación con JWT y un modelo básico de fichajes. El frontend puede implementarse en React consumiendo estas APIs.

## Requisitos
- Node.js 18+
- npm

## Instalación
```bash
npm install
```

## Comandos
- `npm run dev` &rarr; inicia el servidor en modo desarrollo con `nodemon`.
- `npm run build` &rarr; compila el código TypeScript en `dist`.
- `npm start` &rarr; ejecuta el código compilado.

## Despliegue en LucusHost
1. Compila la aplicación:
   ```bash
   npm run build
   ```
2. Sube el contenido del proyecto a tu hosting.
3. Asegúrate de que Node.js esté disponible e instala las dependencias con `npm install`.
4. Ejecuta `npm start` para arrancar el servidor.

Puedes configurar un gestor como PM2 para mantener el proceso activo.
