pipeline {
    agent any

    stages {
        stage('Docker Down') {
            steps {
                bat 'docker compose down || exit 0'
            }
        }

        stage('Docker Build & Up') {
            steps {
                bat 'docker compose up -d --build'
            }
        }

        stage('Check Running Containers') {
            steps {
                bat 'docker ps'
            }
        }
    }
}