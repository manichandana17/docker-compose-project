pipeline {
    agent any

    stages {

        stage('Stop Containers') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Build & Run') {
            steps {
                sh 'docker compose up -d --build'
            }
        }

        stage('Check Running') {
            steps {
                sh 'docker ps'
            }
        }
    }
}