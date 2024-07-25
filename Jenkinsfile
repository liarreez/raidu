pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'your_docker_registry'
        DOCKER_IMAGE = 'your_app_image_name'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master',
                    credentialsId: 'gitlab-access-token',
                    url: 'https://lab.ssafy.com/s11-webmobile1-sub2/S11P12A108.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def dockerImage = docker.build("${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                    docker.withRegistry('https://your_docker_registry_url', 'docker-credentials-id') {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy Docker Image') {
            steps {
                script {
                    sh 'docker-compose down'
                    sh 'docker-compose pull'
                    sh 'docker-compose up -d'
                }
            }
        }
    }
}
