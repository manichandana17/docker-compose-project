pipeline {
    agent any

    environment {
        DB_PASS = credentials('db-password-id') 
    }

    stages {

        stage('Build Image') {
            steps {
                sh 'docker build -t laharikalva/my_app:$BUILD_NUMBER .'
            }
        }

        stage('Push Image') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
            sh '''
            docker login -u $USER -p $PASS
            docker push laharikalva/my_app:$BUILD_NUMBER
            '''
        }
    }
}

       stage('Deploy to Dev') {
    steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-dev-key', keyFileVariable: 'SSH_KEY')]) {
            sh """
                ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ec2-user@13.61.26.69 "
                    # Stop/Remove old container
                    docker stop my-app || true
                    docker rm my-app || true
                    
                   # Use -e to pass the secret variable into the Docker container
                            docker run -d --name my-app -e DB_PASS=${DB_PASS} -p 3001:3000 laharikalva/my_app:${env.BUILD_NUMBER}
                        "
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
        // Use the same credential ID if it's the same key, or create a new one for QA
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-dev-key', keyFileVariable: 'SSH_KEY')]) {
            sh """
                ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ec2-user@13.60.64.164 "
                    docker stop my-app-qa || true
                    docker rm my-app-qa || true
                    docker pull laharikalva/my_app:${env.BUILD_NUMBER}
                    docker run -d --name my-app-qa -p 3002:3000 laharikalva/my_app:${env.BUILD_NUMBER}

                "
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
        // Use the same credential ID you used for Dev/QA
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-dev-key', keyFileVariable: 'SSH_KEY')]) {
            sh """
                ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ec2-user@13.60.82.120 "
                    docker stop my-app-prod || true
                    docker rm my-app-prod || true
                    
                    # Use the build number variable here!
                    docker pull laharikalva/my_app:${env.BUILD_NUMBER}
                    docker run -d --name my-app-prod -p 80:3000 laharikalva/my_app:${env.BUILD_NUMBER}
                "
            """
        }
    }
}
    }

}
