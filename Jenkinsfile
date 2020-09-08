pipeline {
  agent {
    kubernetes {
      label 'node-erbium'
    }
  }
  stages {
    stage('Prepare') {
      steps {
        script {
          env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        }
        container('vault') {
          script {
            env.TUNNEL_IDENTIFIER = sh(script: 'echo ${GIT_COMMIT}-${BUILD_NUMBER}', returnStdout: true)
            env.GITHUB_TOKEN = sh(script: 'vault read -field=value secret/ops/token/github', returnStdout: true)
            env.CODECOV_TOKEN = sh(script: 'vault read -field=molgenis-app-biobank-explorer-vue-cli4 secret/ops/token/codecov', returnStdout: true)
            env.SAUCE_CRED_USR = sh(script: 'vault read -field=username secret/ops/token/saucelabs', returnStdout: true)
            env.SAUCE_CRED_PSW = sh(script: 'vault read -field=value secret/ops/token/saucelabs', returnStdout: true)
            env.REGISTRY_CRED_USR = sh(script: 'vault read -field=username secret/ops/account/nexus', returnStdout: true)
            env.REGISTRY_CRED_PSW = sh(script: 'vault read -field=password secret/ops/account/nexus', returnStdout: true)
          }
        }
        container('node') {
          sh "daemon --name=sauceconnect -- /usr/local/bin/sc -u ${SAUCE_CRED_USR} -k ${SAUCE_CRED_PSW} -i ${TUNNEL_IDENTIFIER}"
        }
      }
    }
    stage('Build: [ pull request ]') {
      when {
        changeRequest()
      }
      steps {
        container('node') {
          sh "yarn install"
          sh "yarn test:unit"
         // sh "yarn test:e2e --env chrome,firefox"
        }
      }
      post {
        always {
          container('node') {
            sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
          }
        }
      }
    }
    stage('Build container serving the artifacts [ PR ]') {
            when {
                changeRequest()
            }
            environment {
                TAG = "PR-${CHANGE_ID}"
                DOCKER_CONFIG="/root/.docker"
            }
            steps {
                container('node') {
                    sh "yarn build:preview"
                }
                container (name: 'kaniko', shell: '/busybox/sh') {
                    sh "#!/busybox/sh\nmkdir -p ${DOCKER_CONFIG}"
                    sh "#!/busybox/sh\necho '{\"auths\": {\"registry.molgenis.org\": {\"auth\": \"${NEXUS_AUTH}\"}}}' > ${DOCKER_CONFIG}/config.json"
                    sh "#!/busybox/sh\n/kaniko/executor --context ${WORKSPACE} --destination ${LOCAL_REPOSITORY}:${TAG}"
                }
            }
        }
    stage('Deploy preview [ PR ]') {
        when {
            changeRequest()
        }
        environment {
            TAG = "PR-${CHANGE_ID}"
            NAME = "preview-bbmri-${TAG.toLowerCase()}"
        }
        steps {
            container('vault') {
                sh "mkdir ${JENKINS_AGENT_WORKDIR}/.rancher"
                sh "vault read -field=value secret/ops/jenkins/rancher/cli2.json > ${JENKINS_AGENT_WORKDIR}/.rancher/cli2.json"
            }
            container('rancher') {
                sh "rancher apps delete ${NAME} || true" 
                sh "sleep 5s" // wait for deletion
                sh "rancher apps install " +
                    "cattle-global-data:molgenis-helm-molgenis-frontend " +
                    "${NAME} " +
                    "--no-prompt " +
                    "--set environment=dev " +
                    "--set image.tag=${TAG} " +
                    "--set image.repository=${LOCAL_REGISTRY} " +
                    "--set proxy.backend.service.targetNamespace=molgenis-abcde " +
                    "--set proxy.backend.service.targetRelease=master " +
                    "--set image.pullPolicy=Always " +
                    "--set readinessPath=/index.html"
            }
        }
        post {
            success {
                hubotSend(message: "PR Preview available on https://${NAME}.dev.molgenis.org", status:'INFO', site: 'slack-pr-app-team')
                container('node') {
                    sh "set +x; curl -X POST -H 'Content-Type: application/json' -H 'Authorization: token ${GITHUB_TOKEN}' " +
                        "--data '{\"body\":\":star: PR Preview available on https://${NAME}.dev.molgenis.org\"}' " +
                        "https://api.github.com/repos/molgenis/molgenis-app-biobank-explorer/issues/${CHANGE_ID}/comments"
                }
            }
        }
    }
    stage('Build: [ master ]') {
      when {
        branch 'master'
      }
      steps {
        milestone 1
        container('node') {
          sh "yarn install"
          sh "yarn test:unit"
         // sh "yarn test:e2e --env chrome,firefox"
        }
      }
      post {
        always {
          container('node') {
            sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
          }
        }
      }
    }
    stage('Release: [ master ]') {
      when {
        branch 'master'
      }
      environment {
        REPOSITORY = 'molgenis/molgenis-app-biobank-explorer'
      }
      steps {
        timeout(time: 30, unit: 'MINUTES') {
          script {
            env.RELEASE_SCOPE = input(
              message: 'Do you want to release?',
              ok: 'Release',
              parameters: [
                choice(choices: 'patch\nminor\nmajor', description: '', name: 'RELEASE_SCOPE')
              ]
            )
          }
        }
        milestone 2
        container('node') {
          sh "git remote set-url origin https://${GITHUB_TOKEN}@github.com/${REPOSITORY}.git"

          sh "git checkout -f ${BRANCH_NAME}"

          sh "npm config set unsafe-perm true"
          sh "npm version ${RELEASE_SCOPE} -m '[ci skip] [npm-version] %s'"

          sh "git push --tags origin ${BRANCH_NAME}"
          hubotSend(message: "${env.REPOSITORY} has been successfully deployed on ${env.LOCAL_REGISTRY}.", status:'SUCCESS')
        }
      }
    }
  }
  post {
    always {
      container('node') {
        sh "daemon --name=sauceconnect --stop"
      }
    }
    success {
      hubotSend(message: 'Build success', status:'INFO', site: 'slack-pr-app-team')
    }
    failure {
      hubotSend(message: 'Build failed', status:'ERROR', site: 'slack-pr-app-team')
    }
  }
}
