pipeline {
  agent any
  options { timestamps(); skipDefaultCheckout() }

  parameters {
    string(name: 'TAG', defaultValue: 'latest', description: 'Tag de la imagen Docker')
    choice(name: 'ENV', choices: ['dev', 'prod'], description: 'Entorno de despliegue')
    string(name: 'REMOTE_DIR', defaultValue: '/home/neixt/evolution-profe', description: 'Ruta de despliegue en el servidor remoto')
    booleanParam(name: 'CLEANUP_REMOTE', defaultValue: true, description: 'Ejecutar docker image prune -af en el remoto')
  }

  environment {
    DOCKER_BUILDKIT = '1'
    COMPOSE_DOCKER_CLI_BUILD = '1'
    USER_IMG = 'neixt-evolution-profe'
    TAG = "${params.TAG ?: 'latest'}"
  }

  stages {

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build image') {
      steps {
        sh '''
          set -e
          echo "===> Variables: USER_IMG=${USER_IMG}  TAG=${TAG}  ENV=${ENV}"

          if [ ! -f Dockerfile ]; then
            echo "ERROR: No se encontró el Dockerfile en $(pwd)"
            ls -la
            exit 1
          fi

          : "${TAG:=latest}"
          echo "Usando TAG=${TAG}"

          docker build -f Dockerfile -t "${USER_IMG}:${TAG}" .
          docker images | grep "${USER_IMG}" || true
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
            echo "===> Enviando imagen ${USER_IMG}:${TAG} a ${AWS_HOST}"
            docker save "${USER_IMG}:${TAG}" | gzip | \\
              sshpass -p "$REMOTE_PASS" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$AWS_HOST" 'gunzip | docker load'
          """
        }
      }
    }

    stage('Empaquetar compose y env') {
      steps {
        withCredentials([file(credentialsId: 'neixt-iknitl-env', variable: 'ENV_FILE')]) {
          sh """
            set -e
            echo "===> Generando docker-compose.ci.override.yml con image concreta para ambos posibles servicios"
            # IMPORTANTE: los nombres deben coincidir con los del compose base
            cat > docker-compose.ci.override.yml <<YAML
version: "3.9"
services:
  evolution-profe:
    image: ${USER_IMG}:${TAG}
  evolution-profe-angular:
    image: ${USER_IMG}:${TAG}
YAML

            echo "===> Copiando env desde credencial a ./.env.ci"
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
            echo "===> Creando carpeta remota ${REMOTE_DIR} en ${AWS_HOST}"
            sshpass -p "$REMOTE_PASS" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$AWS_HOST" "mkdir -p ${REMOTE_DIR} || true"

            echo "===> Enviando compose base, override y .env"
            sshpass -p "$REMOTE_PASS" scp -o StrictHostKeyChecking=no docker-compose.yml docker-compose.ci.override.yml "$REMOTE_USER@$AWS_HOST:${REMOTE_DIR}/"
            sshpass -p "$REMOTE_PASS" scp -o StrictHostKeyChecking=no .env.ci "$REMOTE_USER@$AWS_HOST:${REMOTE_DIR}/.env"

            echo "===> Ajustes y despliegue en remoto"
            sshpass -p "$REMOTE_PASS" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$AWS_HOST" '
              set -e
              cd ${REMOTE_DIR}

              export DOCKER_BUILDKIT=1
              export NODE_ENV=${ENV == "prod" ? "production" : "development"}
              export COMPOSE_PROJECT_NAME=evolution-profe

              echo "-> Etiquetando compatibilidad (por si el compose pide evolution-profe-angular:latest)"
              if docker image inspect ${USER_IMG}:${TAG} >/dev/null 2>&1; then
                docker tag ${USER_IMG}:${TAG} evolution-profe-angular:latest || true
              fi

              echo "-> Config final (docker compose config):"
              docker compose -f docker-compose.yml -f docker-compose.ci.override.yml config | sed -n "1,200p" || true

              echo "-> Levantando servicios (sin build)"
              docker compose -f docker-compose.yml -f docker-compose.ci.override.yml up -d \\
                --remove-orphans --pull=never --no-build

              ${CLEANUP_REMOTE ? "docker image prune -af || true" : "true"}
              docker system df || true
            '
          """
        }
      }
    }
  } // stages

  post {
    success {
      echo "✔ Despliegue OK en REMOTE_DIR=${params.REMOTE_DIR} con TAG=${env.TAG}"
    }
    always {
      cleanWs(deleteDirs: true)
    }
  }
}
