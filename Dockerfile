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
# COPY package.json package-lock.json ./
# COPY src/ ./src/
# COPY static/ ./static/
COPY index.html ./
COPY index.optimized.html ./
COPY assets/ ./assets/
# --- Production Stage ---
# Use the official Nginx image for the final, lean image.
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Buat user dan group non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy custom nginx config
COPY --chown=root:root nginx.conf /etc/nginx/conf.d/default.conf

# Copy hanya file/folder statis yang diperlukan
COPY --from=build --chown=root:root --chmod=644 /app/index.html /usr/share/nginx/html/
COPY --from=build --chown=root:root --chmod=644 /app/index.optimized.html /usr/share/nginx/html/
COPY --from=build --chown=root:root --chmod=755 /app/assets/ /usr/share/nginx/html/assets/
COPY --from=build --chown=root:root --chmod=755 /app/assets/js/ /usr/share/nginx/html/assets/js/
COPY --from=build --chown=root:root --chmod=755 /app/assets/css/ /usr/share/nginx/html/assets/css/
COPY --from=build --chown=root:root --chmod=755 /app/assets/img/ /usr/share/nginx/html/assets/img/


# Ganti user ke non-root
USER appuser

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]