# --- Frontend Build ---
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
COPY frontend/.env.prod /app/.env
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

CMD ["node", "dist/main"]
