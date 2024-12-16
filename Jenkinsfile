pipeline {
  agent any

  stages {

     stage('Build') {
         steps {
             echo 'Building..'
			 sh """
              docker build -t scalepilot-front ./frontend/sklad
            """
			
            sh """
              docker build -t scalepilot-back ./backend/sklad
            """
         }
     }
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
              docker run -d --name scalepilot-front -p 8072:80 --restart=on-failure scalepilot-front
            """

            sh """
              docker run -d --name scalepilot-back -p 8082:8082 --restart=on-failure scalepilot-back
            """
        }
    }
  }
}