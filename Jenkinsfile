pipeline {
    agent any

    environment {
        // Access credentials directly in the environment block
        DB_PASS = credentials('db-password-id') 
    }

    stages {
        stage('Build Image') {
            steps {
                // Use 'bat' and %BUILD_NUMBER% for Windows
                bat 'docker build -t laharikalva/my_app:%BUILD_NUMBER% .'
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    // Multi-line bat commands use triple quotes
                    bat """
                    docker login -u %USER% -p %PASS%
                    docker push laharikalva/my_app:%BUILD_NUMBER%
                    """
                }
            }
        }

        stage('Deploy to Dev') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-dev-key', keyFileVariable: 'SSH_KEY')]) {
                    // Note: 'ssh' usually requires Git Bash or OpenSSH installed on Windows
                    bat """
                    ssh -o StrictHostKeyChecking=no -i "%SSH_KEY%" ec2-user@13.61.26.69 "docker stop my-app || true && docker rm my-app || true && docker run -d --name my-app -e DB_PASS=%DB_PASS% -p 3001:3000 laharikalva/my_app:%BUILD_NUMBER%"
                    """
                }
            }
        }

        stage('Approval for QA') {
            steps {
                input message: "Deploy to QA?"
            }
        }

        stage('Deploy to QA') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-dev-key', keyFileVariable: 'SSH_KEY')]) {
                    bat """
                    ssh -o StrictHostKeyChecking=no -i "%SSH_KEY%" ec2-user@13.60.64.164 "docker stop my-app-qa || true && docker rm my-app-qa || true && docker pull laharikalva/my_app:%BUILD_NUMBER% && docker run -d --name my-app-qa -p 3002:3000 laharikalva/my_app:%BUILD_NUMBER%"
                    """
                }
            }
        }

        stage('Approval for Prod') {
            steps {
                input message: "Deploy to Production?"
            }
        }

        stage('Deploy to Prod') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-dev-key', keyFileVariable: 'SSH_KEY')]) {
                    bat """
                    ssh -o StrictHostKeyChecking=no -i "%SSH_KEY%" ec2-user@13.60.82.120 "docker stop my-app-prod || true && docker rm my-app-prod || true && docker pull laharikalva/my_app:%BUILD_NUMBER% && docker run -d --name my-app-prod -p 80:3000 laharikalva/my_app:%BUILD_NUMBER%"
                    """
                }
            }
        }
    }
}
