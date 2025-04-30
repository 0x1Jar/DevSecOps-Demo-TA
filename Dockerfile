# Build stage
FROM node:alpine AS build

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files to the default Nginx public folder
COPY . /usr/share/nginx/html

# Remove unnecessary files from the final image
RUN rm -rf /usr/share/nginx/html/Jenkinsfile \
    /usr/share/nginx/html/sonar-project.properties* \
    /usr/share/nginx/html/.git* \
    /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/nginx.conf

# Add security headers
RUN echo 'add_header X-Frame-Options "SAMEORIGIN";' >> /etc/nginx/conf.d/default.conf && \
    echo 'add_header X-Content-Type-Options "nosniff";' >> /etc/nginx/conf.d/default.conf && \
    echo 'add_header X-XSS-Protection "1; mode=block";' >> /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
