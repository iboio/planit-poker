# --- Frontend Build ---
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
<<<<<<< HEAD
COPY frontend/.env.prod ./.env
=======
>>>>>>> 189b50c59d64b24e75fe04af456ce893ac6e741a
RUN npm run build

# --- Backend Build ---
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# --- Final Stage ---
FROM node:20-alpine
WORKDIR /app

COPY --from=backend-build /app /app

COPY --from=frontend-build /app/dist /app/public

EXPOSE 3000

<<<<<<< HEAD
CMD ["node", "dist/main"]
=======
CMD ["node", "dist/main"]
>>>>>>> 189b50c59d64b24e75fe04af456ce893ac6e741a
