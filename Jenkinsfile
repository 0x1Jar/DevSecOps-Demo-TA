pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'static-website'
        // Using Jenkins credential store for sensitive tokens
        SONARQUBE_TOKEN = credentials('sonarqube-token')
    }
    stages {
        stage('Checkout') {
            steps {
                // Use credentials for repository access
                withCredentials([usernamePassword(credentialsId: 'github-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    sh '''
                        git config --global credential.helper cache
                        echo "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com" > ~/.git-credentials
                    '''
                    git branch: 'main', url: 'https://github.com/username/<Repository>.git'
                }
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
