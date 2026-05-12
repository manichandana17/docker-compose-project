pipeline {
    agent any
    environment {
        // Replace with your DockerHub username
        IMAGE_NAME = "your-dockerhub-username/myapp" 
    }
    stages {
        stage('Build Image') {
            steps {
                bat "docker build -t $IMAGE_NAME:$BUILD_NUMBER ."
            }
        }
        stage('Push to DockerHub') {
            steps {
                // Requires DockerHub credentials stored in Jenkins
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                    bat "docker login -u $USER -p $PASS"
                    bat "docker push $IMAGE_NAME:$BUILD_NUMBER"
                }
            }
        }
        stage('Deploy to Dev') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    bat "ssh -o StrictHostKeyChecking=no ec2-user@<DEV-PRIVATE-IP> 'docker pull $IMAGE_NAME:$BUILD_NUMBER && docker run -d -p 3001:3000 $IMAGE_NAME:$BUILD_NUMBER'"
                }
            }
        }
        stage('QA Approval') {
            steps {
                input message: "Deploy to QA Server?"
            }
        }
        stage('Deploy to QA') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    bat "ssh -o StrictHostKeyChecking=no ec2-user@<QA-PRIVATE-IP> 'docker pull $IMAGE_NAME:$BUILD_NUMBER && docker run -d -p 3002:3000 $IMAGE_NAME:$BUILD_NUMBER'"
                }
            }
        }
        stage('Prod Approval') {
            steps {
                input message: "🚀 Deploy to PRODUCTION?"
            }
        }
        stage('Deploy to Prod') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    bat "ssh -o StrictHostKeyChecking=no ec2-user@<PROD-PRIVATE-IP> 'docker pull $IMAGE_NAME:$BUILD_NUMBER && docker run -d -p 80:3000 $IMAGE_NAME:$BUILD_NUMBER'"
                }
            }
        }
    }
}
