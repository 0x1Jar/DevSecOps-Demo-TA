# **CI/CD Pipeline with Jenkins, SonarQube, and Nginx**
![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Jenkins-blue) ![SonarQube](https://img.shields.io/badge/Code%20Analysis-SonarQube-green) ![Nginx](https://img.shields.io/badge/Deployment-Nginx-blue)

This repository demonstrates a complete **CI/CD pipeline** setup using **Jenkins**, **SonarQube**, and **Nginx**. The pipeline automates the process of building, analyzing code quality, and deploying a static website to a server using **Nginx**.

---

## **Overview**

The goal of this project is to create an automated CI/CD pipeline for a **static website** that:
1. **Builds** the static files (HTML, CSS, JavaScript, etc.).
2. **Analyzes** the code for vulnerabilities and quality issues using **SonarQube**.
3. **Deploys** the static website to a server using **Nginx**.

This setup ensures efficient development workflows, improved code quality, and seamless deployment for static websites.

---

## **Tools Used**

- **Jenkins**: Automates the CI/CD pipeline.
- **SonarQube**: Analyzes code for vulnerabilities, bugs, and code smells.
- **Nginx**: Serves the static website efficiently.
- **Docker**: Containerizes the Nginx server for consistent deployment across environments.
- **GitHub**: Hosts the source code and integrates with Jenkins for version control.

---

## **Pipeline Workflow**

The CI/CD pipeline consists of the following stages:

1. **Source Code Checkout**:
   - Jenkins pulls the latest code from the GitHub repository.

2. **Code Analysis**:
   - Runs a static code analysis using SonarQube to detect vulnerabilities, bugs, and code smells.

3. **Docker Build**:
   - Builds a Docker image with **Nginx** to serve the static website.

4. **Deployment**:
   - Deploys the Docker container to a server or cloud environment.

---

## **Prerequisites**

Before setting up the pipeline, ensure you have the following tools installed and configured:

- **Jenkins**:
  - Install Jenkins on your server or local machine.
  - Install necessary plugins: Git, Docker, SonarQube Scanner, etc.

- **SonarQube**:
  - Set up a SonarQube server and configure it with Jenkins.
  - Obtain a SonarQube token for authentication.

- **Docker**:
  - Install Docker on your deployment server.

- **GitHub Repository**:
  - Ensure your repository is properly set up and accessible by Jenkins.

---

## **Setup Instructions**

### **1. Configure Jenkins**

1. **Install Plugins**:
   - Go to **Manage Jenkins > Manage Plugins**.
   - Install the following plugins:
     - Git Plugin
     - Docker Plugin
     - SonarQube Scanner Plugin

2. **Configure SonarQube**:
   - Go to **Manage Jenkins > Configure System**.
   - Add your SonarQube server details and token.

3. **Create a New Pipeline Job**:
   - Create a new pipeline job in Jenkins.
   - Configure the job to pull code from your GitHub repository.

---

### **2. Configure SonarQube**

1. **Set Up SonarQube Server**:
   - Install and run SonarQube locally or use a hosted instance.
   - Access the SonarQube dashboard at `http://localhost:9000`.

2. **Generate Token**:
   - Generate a token in SonarQube and add it to Jenkins for authentication.

3. **Add SonarQube Configuration to Your Project**:
   - Create a `sonar-project.properties` file in the root of your project:
     ```properties
     sonar.projectKey=my-static-website
     sonar.sources=.
     sonar.host.url=http://localhost:9000
     sonar.login=<your-sonarqube-token>
     ```

---

### **3. Configure Nginx**

1. **Create a Dockerfile**:
   - Add a `Dockerfile` to your project to define the Nginx container:
     ```dockerfile
     # Use the official Nginx image
     FROM nginx:alpine

     # Copy static files to the default Nginx public folder
     COPY . /usr/share/nginx/html

     # Expose port 80
     EXPOSE 80

     # Start Nginx
     CMD ["nginx", "-g", "daemon off;"]
     ```

2. **Test Locally**:
   - Build and run the Docker image locally to ensure it works:
     ```bash
     docker build -t static-website .
     docker run -d -p 80:80 static-website
     ```
   - Open your browser and navigate to `http://localhost` to verify the website.

---

### **4. Define the Jenkins Pipeline**

Create a `Jenkinsfile` in the root of your repository to define the pipeline stages:

```groovy
pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'static-website'
        SONARQUBE_TOKEN = credentials('sonarqube-token')
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/zxJar/DevSecOps-Demo-TA.git'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube analysis...'
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image with Nginx...'
                script {
                    docker.build(DOCKER_IMAGE)
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying static website with Nginx...'
                script {
                    docker.image(DOCKER_IMAGE).run('-p 80:80')
                }
            }
        }
    }
}
```

---

## **How It Works**

1. Jenkins pulls the latest code from GitHub.
2. The pipeline runs a static code analysis using SonarQube to detect vulnerabilities.
3. If the code passes the analysis, Jenkins builds a Docker image with **Nginx** to serve the static website.
4. Finally, the Docker container is deployed to the server, and the website is served on port 80.

---

## **Contributing**

Feel free to contribute to this project by opening issues or submitting pull requests. Any feedback or suggestions are welcome!

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

## **Contact**

For questions or feedback, feel free to reach out:
- GitHub: [@zxJar](https://github.com/zxJar)
