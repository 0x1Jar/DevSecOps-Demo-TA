# Build stage: This stage prepares the application files.
# Using a lightweight base image as we are only copying files.
FROM alpine:3.18 AS build

# Set working directory
WORKDIR /app

# Copy all project files into the build stage.
# The .dockerignore file will prevent sensitive files from being included.
COPY . .

# --- Production Stage ---
# Use the official Nginx image for the final, lean image.
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the necessary static files from the build stage.
# This is the key security improvement: only application code is copied,
# and no sensitive files like .git, Jenkinsfile, etc., ever enter the final image.
COPY --from=build --chown=nginx:nginx /app/ /usr/share/nginx/html/

# Add security headers
RUN echo 'add_header X-Frame-Options "SAMEORIGIN";' >> /etc/nginx/conf.d/default.conf && \
    echo 'add_header X-Content-Type-Options "nosniff";' >> /etc/nginx/conf.d/default.conf && \
    echo 'add_header X-XSS-Protection "1; mode=block";' >> /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
