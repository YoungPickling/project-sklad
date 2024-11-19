pipeline {
  agent any

  stages {

    // stage('Build') {
    //     steps {
    //         echo 'Building..'
    //     }
    // }
    // stage('Test') {
    //     steps {
    //         echo 'Testing..'
    //     }
    // }
    
    stage('Deploy') {
        steps {
            sh """
              if docker ps -a | grep -q scalepilot-back; then
                docker stop scalepilot-back || true
                docker rm scalepilot-back || true
              fi
            """

            sh """
              if docker ps -a | grep -q scalepilot-front; then
                docker stop scalepilot-front || true
                docker rm scalepilot-front || true
              fi
            """

            sh """
              docker compose up
            """
        }
    }
  }
}