# Build stage: This stage prepares the application files.
# Using a lightweight base image as we are only copying files.
FROM alpine:3.18 AS build

# Set working directory
WORKDIR /app

# Install necessary tools for the build stage (e.g., for health checks or debugging)
# This is a good practice to ensure the build stage has basic utilities.
RUN apk add --no-cache curl

# Copy all project files into the build stage.
# The .dockerignore file will prevent sensitive files from being included.
COPY . .

# --- Production Stage ---
# Use the official Nginx image for the final, lean image.
FROM nginx:alpine

# Buat user dan group non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy custom nginx config
COPY --chown=appuser:appgroup nginx.conf /etc/nginx/conf.d/default.conf

# Copy hanya file/folder statis yang diperlukan
COPY --from=build --chown=root:root --chmod=755 /app/static/ /usr/share/nginx/html/static/
COPY --from=build --chown=root:root --chmod=644 /app/index.html /usr/share/nginx/html/

# Ganti user ke non-root
USER appuser

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]