# --- Frontend Build ---
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY ../frontend ./
RUN npm install && npm run build

# --- Backend Build ---
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY ./ ./
RUN npm install && npm run build

# --- Final Image ---
FROM node:20-alpine
WORKDIR /app

# Copy built backend
COPY --from=backend-build /app /app

# Copy frontend build to public folder
COPY --from=frontend-build /app/dist /app/public

# Start command
CMD ["node", "dist/main"]