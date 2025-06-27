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

# Set secure permissions on the files within the build stage itself.
# This ensures that the artifacts copied to the final stage are already secured.
RUN find /app -type d -exec chmod 755 {} + && \
    find /app -type f -exec chmod 644 {} +

# --- Production Stage ---
# Use the official Nginx image for the final, lean image.
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the necessary static files from the build stage.
# This is the key security improvement: only application code is copied,
# and no sensitive files like .git, Jenkinsfile, etc., ever enter the final image.
COPY --from=build --chown=nginx:nginx /app/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
