# **CI/CD Pipeline with Jenkins, SonarQube, and Docker on VPS**
![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Jenkins-blue) ![SonarQube](https://img.shields.io/badge/Code%20Analysis-SonarQube-green) ![Docker](https://img.shields.io/badge/Deployment-Docker-blue)

This repository demonstrates a complete **CI/CD pipeline** setup using **Jenkins**, **SonarQube**, and **Docker**. The pipeline automates the process of building, analyzing code quality, and deploying applications to a server. Since GitHub does not support webhooks with local networks, this setup uses **three VPS servers** for Jenkins, SonarQube, and Docker.

---

## **Overview**

The goal of this project is to create an automated CI/CD pipeline that:
1. **Builds** the application code.
2. **Analyzes** the code for vulnerabilities and quality issues using **SonarQube**.
3. **Deploys** the application to a server using **Docker**.

This setup ensures efficient development workflows, improved code quality, and seamless deployment in a production-like environment.

---

## **Tools Used**

- **Jenkins**: Automates the CI/CD pipeline (hosted on a dedicated VPS).
- **SonarQube**: Analyzes code for vulnerabilities, bugs, and code smells (hosted on a dedicated VPS).
- **Docker**: Containerizes the application for consistent deployment across environments (hosted on a dedicated VPS).
- **GitHub**: Hosts the source code and integrates with Jenkins for version control.

---

## **Pipeline Workflow**

The CI/CD pipeline consists of the following stages:

1. **Source Code Checkout**:
   - Jenkins pulls the latest code from the GitHub repository.

2. **Code Analysis**:
   - Runs a static code analysis using SonarQube to detect vulnerabilities, bugs, and code smells.

3. **Docker Build**:
   - Builds a Docker image for the application.

4. **Deployment**:
   - Deploys the Docker container to the Docker server (VPS).

---

## **Prerequisites**

Before setting up the pipeline, ensure you have the following tools installed and configured:

- **Three VPS Servers**:
  - **Jenkins Server**: For running the CI/CD pipeline.
  - **SonarQube Server**: For code quality analysis.
  - **Docker Server**: For hosting the deployed application.

- **GitHub Repository**:
  - Ensure your repository is properly set up and accessible by Jenkins.

- **Webhook Configuration**:
  - Configure a webhook in GitHub to notify the Jenkins server whenever changes are pushed.

---

## **Setup Instructions**

### **1. Configure Jenkins on VPS**

1. **Install Jenkins**:
   - Install Jenkins on your VPS:
     ```bash
     sudo apt update
     sudo apt install openjdk-11-jdk -y
     curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
     echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
     sudo apt update
     sudo apt install jenkins -y
     sudo systemctl start jenkins
     ```

2. **Install Plugins**:
   - Go to **Manage Jenkins > Manage Plugins**.
   - Install the following plugins:
     - Git Plugin
     - Docker Plugin
     - SonarQube Scanner Plugin

3. **Configure SonarQube**:
   - Add your SonarQube server details and token in **Manage Jenkins > Configure System**.

4. **Create a New Pipeline Job**:
   - Create a new pipeline job in Jenkins.
   - Configure the job to pull code from your GitHub repository.

5. **Set Up Webhook**:
   - In your GitHub repository, go to **Settings > Webhooks > Add Webhook**.
   - Set the payload URL to your Jenkins server's IP address (e.g., `http://<jenkins-vps-ip>:8080/github-webhook/`).

---

### **2. Configure SonarQube on VPS**

1. **Install SonarQube**:
   - Install SonarQube on your VPS:
     ```bash
     sudo apt update
     sudo apt install openjdk-11-jdk -y
     wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-9.9.0.65466.zip
     unzip sonarqube-9.9.0.65466.zip -d /opt/
     sudo useradd -r -m -U -d /opt/sonarqube -s /bin/bash sonarqube
     sudo chown -R sonarqube:sonarqube /opt/sonarqube
     sudo nano /opt/sonarqube/conf/sonar.properties
     ```
   - Update the `sonar.web.host` property to your VPS IP:
     ```properties
     sonar.web.host=<sonarqube-vps-ip>
     ```

2. **Start SonarQube**:
   ```bash
   sudo systemctl start sonarqube
   ```

3. **Generate Token**:
   - Access the SonarQube dashboard at `http://<sonarqube-vps-ip>:9000`.
   - Generate a token and add it to Jenkins for authentication.

4. **Add SonarQube Configuration to Your Project**:
   - Create a `sonar-project.properties` file in the root of your project:
     ```properties
     sonar.projectKey=my-app
     sonar.sources=.
     sonar.host.url=http://<sonarqube-vps-ip>:9000
     sonar.login=<your-sonarqube-token>
     ```

---

### **3. Configure Docker on VPS**

1. **Install Docker**:
   - Install Docker on your VPS:
     ```bash
     sudo apt update
     sudo apt install docker.io -y
     sudo systemctl start docker
     sudo systemctl enable docker
     ```

2. **Create a Dockerfile**:
   - Add a `Dockerfile` to your project to define the container image:
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

3. **Test Locally**:
   - Build and run the Docker image locally to ensure it works:
     ```bash
     docker build -t static-website .
     docker run -d -p 80:80 static-website
     ```

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
                echo 'Building Docker image...'
                script {
                    docker.build(DOCKER_IMAGE)
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
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
3. If the code passes the analysis, Jenkins builds a Docker image.
4. Finally, the Docker container is deployed to the Docker server (VPS).

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
