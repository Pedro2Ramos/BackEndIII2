# Proyecto de Adopciones

## Instalación
1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Crear archivo .env con las variables necesarias
4. Ejecutar: `npm start`

## Tests
- Ejecutar: `npm test`

## Docker
- Imagen disponible en: docker.io/pedrodosramos/adoption-project
- Para ejecutar: `docker run -p 8080:8080 tu-usuario/adoption-project`

## Documentación
- Swagger disponible en: `http://localhost:8080/api-docs`

## Endpoints
- GET /api/adoptions - Obtener todas las adopciones
- POST /api/adoptions - Crear una nueva adopción
- GET /api/adoptions/:id - Obtener una adopción por ID
- PUT /api/adoptions/:id - Actualizar una adopción
- DELETE /api/adoptions/:id - Eliminar una adopción 