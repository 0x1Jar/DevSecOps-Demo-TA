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

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf



# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
