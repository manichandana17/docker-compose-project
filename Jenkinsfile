pipeline {
    agent any

    stages {

        stage('Stop Containers') {
            steps {
                bat 'docker compose down || exit 0'
            }
        }

        stage('Build & Run') {
            steps {
                bat 'docker compose up -d --build'
            }
        }

        stage('Check Running') {
            steps {
                bat 'docker ps'
            }
        }
    }
}