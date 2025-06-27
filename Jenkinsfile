pipeline {
  agent any

  options {
    // Improve efficiency with build discard strategy
    buildDiscarder(logRotator(numToKeepStr: '5'))
    // Skip default checkout to do it manually in stages
    skipDefaultCheckout(true)
    // Timeout if the build takes too long
    timeout(time: 30, unit: 'MINUTES')
  }

  stages {
    stage('Checkout') {
      steps {
        // Clean workspace before checkout
        cleanWs()
        checkout scm
      }
    }

    stage('Parallel Tasks') {
      parallel {
        stage('SonarQube Analysis') {
          steps {
            script {
              def scannerHome = tool 'SonarScanner'
              // Use Jenkins credentials for SonarQube authentication
              withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONARQUBE_TOKEN')]) {
                withSonarQubeEnv('SonarQube') {
                  sh """
                    ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.host.url=${SONAR_HOST_URL} \
                    -Dsonar.login=${SONARQUBE_TOKEN} \
                    -Dsonar.projectKey=demo-devsecops \
                    -Dsonar.projectName='Demo DevSecOps' \
                    -Dsonar.projectVersion=1.0 \
                    -Dsonar.sources=. \
                    -Dsonar.exclusions=node_modules/**,**/*.min.js,**/*.min.css \
                    -Dsonar.sourceEncoding=UTF-8
                  """
                }
              }
            }
          }
        }

        stage('Optimize Assets') {
          steps {
            echo 'Optimizing images and assets...'
            // This would be where you run optimization scripts
            // sh 'npm run optimize-images'
          }
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          // Build the Docker image with a unique tag
          def imageTag = "demo-devsecops:${env.BUILD_NUMBER}"
          sh "docker build -t ${imageTag} ."
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          def imageName = "demo-devsecops:${env.BUILD_NUMBER}"
          echo "Deploying ${imageName}..."
          // Stop and remove any existing container with the same name to avoid conflicts
          sh "docker stop devsecops-app || true"
          sh "docker rm devsecops-app || true"
          // Run the new container with the correct port mapping for the reverse proxy
          sh "docker run -d --name devsecops-app -p 8085:80 ${imageName}"
        }
      }
    }
  }

  post {
    always {
      // Clean up resources
      cleanWs()
    }
    success {
      echo 'Build and deployment successful!'
    }
    failure {
      echo 'Build or deployment failed!'
    }
  }
}