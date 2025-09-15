pipeline {
  agent any
  options { timestamps(); skipDefaultCheckout() }

  parameters {
    string(name: 'TAG', defaultValue: 'latest', description: 'Tag de la imagen')
    choice(name: 'ENV', choices: ['dev', 'prod'], description: 'Entorno de despliegue')
    string(name: 'REMOTE_DIR', defaultValue: '/home/neixt/evolution-profe', description: 'Ruta en el servidor remoto')
    booleanParam(name: 'CLEANUP_REMOTE', defaultValue: true, description: 'docker image prune -af en el remoto')
  }

  environment {
    DOCKER_BUILDKIT = '1'
    COMPOSE_DOCKER_CLI_BUILD = '1'
    USER_IMG = 'neixt-evolution-profe'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }
stage('Build evolution-profe') {
  steps {
    sh '''
      set -e
      if [ ! -f Dockerfile ]; then
        echo "ERROR: No se encontrÃ³ el Dockerfile en $(pwd)"
        ls -la
        exit 1
      fi

      docker build \
        -f Dockerfile \
        -t ${USER_IMG}:${TAG} .
    '''
  }
}



    stage('Transferir imagen al remoto') {
      steps {
        withCredentials([
          usernamePassword(credentialsId: 'NEIXT-IKNITL-USER', usernameVariable: 'REMOTE_USER', passwordVariable: 'REMOTE_PASS'),
          string(credentialsId: 'NEIXT-IKNITL-IP', variable: 'AWS_HOST')
        ]) {
          sh """
            set -e
            docker save ${USER_IMG}:${TAG} | gzip | \
              sshpass -p "$REMOTE_PASS" ssh -o StrictHostKeyChecking=no $REMOTE_USER@$AWS_HOST 'gunzip | docker load'
          """
        }
      }
    }

stage('Empaquetar compose y env') {
  steps {
    withCredentials([file(credentialsId: 'neixt-iknitl-env', variable: 'ENV_FILE')]) {
      sh """
        set -e
        cat > docker-compose.ci.override.yml <<'YAML'
version: "3.9"
services:
  evolution-profe:
    image: ${USER_IMG}:${TAG}
YAML
        cp "${ENV_FILE}" ./.env.ci
      """
    }
  }
}


    stage('Deploy remoto') {
      steps {
        withCredentials([
          usernamePassword(credentialsId: 'NEIXT-IKNITL-USER', usernameVariable: 'REMOTE_USER', passwordVariable: 'REMOTE_PASS'),
          string(credentialsId: 'NEIXT-IKNITL-IP', variable: 'AWS_HOST')
        ]) {
          sh """
            set -e
            sshpass -p "$REMOTE_PASS" ssh -o StrictHostKeyChecking=no $REMOTE_USER@$AWS_HOST "mkdir -p '${REMOTE_DIR}'"
            sshpass -p "$REMOTE_PASS" scp -o StrictHostKeyChecking=no docker-compose.yml docker-compose.ci.override.yml $REMOTE_USER@$AWS_HOST:'${REMOTE_DIR}/'
            sshpass -p "$REMOTE_PASS" scp -o StrictHostKeyChecking=no .env.ci $REMOTE_USER@$AWS_HOST:'${REMOTE_DIR}/.env'
            sshpass -p "$REMOTE_PASS" ssh -o StrictHostKeyChecking=no $REMOTE_USER@$AWS_HOST "
              set -e
              cd '${REMOTE_DIR}'
              export DOCKER_BUILDKIT=1
              export NODE_ENV=${ENV == 'prod' ? 'production' : 'development'}
              docker compose -f docker-compose.yml -f docker-compose.ci.override.yml up -d --remove-orphans --pull=never
              ${CLEANUP_REMOTE ? "docker image prune -af || true" : "true"}
              docker system df || true
            "
          """
        }
      }
    }
  } // <-- stages

  post {
    success {
      echo "Despliegue completado en REMOTE_DIR=${params.REMOTE_DIR} con TAG=${params.TAG}"
    }
    always {
      cleanWs(deleteDirs: true)
    }
  }
}