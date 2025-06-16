pipeline {
  agent any

  environment {
    IMAGE_F = 'scalepilot-front-img'
    CONTAINER_F = 'scalepilot-front'
    APP_PORT_F = '8072'
    CONTAINER_PORT_F = '80'
    IMAGE_NAME_B = 'scalepilot-back-img'
    CONTAINER_NAME_B = 'scalepilot-back'
    APP_PORT_B = '8082'
    CONTAINER_PORT_B = '8082'
  }

  stages {

    stage('Build') {
        steps {
            sh """
              if docker images | grep -q ${IMAGE_F}; then
                  docker rmi -f ${IMAGE_F} || true
              fi
            """

            sh """
              docker build -t ${IMAGE_F} ./frontend/sklad
            """

            sh """
              if docker images | grep -q ${IMAGE_NAME_B}; then
                  docker rmi -f ${IMAGE_NAME_B} || true
              fi
            """
			
            sh """
              docker build -t ${IMAGE_NAME_B} ./backend/sklad
            """
        }
    }

    stage('Deploy') {
        steps {
            sh """
              if docker ps -a | grep -q ${CONTAINER_NAME_B}; then
                docker stop ${CONTAINER_NAME_B} || true
                docker rm ${CONTAINER_NAME_B} || true
              fi
            """

            sh """
              docker run -d --name ${CONTAINER_NAME_B} -p ${APP_PORT_B}:${CONTAINER_PORT_B} --restart=always ${IMAGE_NAME_B}
            """

            sh """
              if docker ps -a | grep -q ${CONTAINER_F}; then
                docker stop ${CONTAINER_F} || true
                docker rm ${CONTAINER_F} || true
              fi
            """

            sh """
              docker run -d --name ${CONTAINER_F} -p ${APP_PORT_F}:${CONTAINER_PORT_F} --restart=always ${IMAGE_F}
            """
        }
    }
  }
}