# --- Frontend Build ---
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./     # sadece gerekli dosyaları önce al
RUN npm install
COPY frontend/ .
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

# Backend'i al
COPY --from=backend-build /app /app

# FE build'i backend/public klasörüne al
COPY --from=frontend-build /app/dist /app/public

# Açılacak port (isteğe bağlı)
EXPOSE 3000

CMD ["node", "dist/main"]
