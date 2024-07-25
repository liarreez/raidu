pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'goldenkiwi971202/myapp'
        GIT_CREDENTIALS_ID = 'JenkinsAccessToken' // GitLab 자격 증명 ID
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials' // Docker Registry 자격 증명 ID
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master',
                    credentialsId: "${GIT_CREDENTIALS_ID}",
                    url: 'https://lab.ssafy.com/s11-webmobile1-sub2/S11P12A108.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def dockerImage = docker.build("${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                    docker.withRegistry('https://your_docker_registry_url', "${DOCKER_CREDENTIALS_ID}") {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Test Docker Image') {
            steps {
                script {
                    docker.image("${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${env.BUILD_NUMBER}").inside {
                        sh 'echo "Running tests inside Docker container"'
                        // 여기서 필요한 테스트 명령어들을 실행
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
