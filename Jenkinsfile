node {
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    // Use Jenkins credentials for SonarQube authentication
    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONARQUBE_TOKEN')]) {
      withSonarQubeEnv('SonarQube') {
        sh """
          ${scannerHome}/bin/sonar-scanner \
          -Dsonar.host.url=${SONAR_HOST_URL} \
          -Dsonar.login=${SONARQUBE_TOKEN}
        """
      }
    }
  }
}