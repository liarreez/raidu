pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master',
                    credentialsId: 'gitlab-access-token',
                    url: 'https://lab.ssafy.com/s11-webmobile1-sub2/S11P12A108.git'
            }
        }

        stage('Build and Run with Docker Compose') {
            steps {
                script {
                    sh 'docker-compose down'
                    sh 'docker-compose build'
                    sh 'docker-compose up -d'
                }
            }
        }
    }
}
