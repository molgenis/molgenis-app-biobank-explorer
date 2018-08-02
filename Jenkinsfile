pipeline {
  agent {
    kubernetes {
      label 'node-carbon'
    }
  }
  environment {
    ORG = 'molgenis'
  }
  stages {
    stage('Prepare') {
      steps {
        script {
          env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        }
      }
    }
    stage('Install and test: [ pull request ]') {
      when {
        changeRequest()
      }
      steps {
        container('node') {
          sh "yarn install"
          sh "yarn unit"
          sh "yarn e2e"
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
    stage('Install, test and build: [ master ]') {
      when {
        branch 'master'
      }
      steps {
        milestone 1
        container('node') {
          sh "yarn install"
          sh "yarn unit"
          sh "yarn e2e"
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
        APP_NAME = 'molgenis-app-biobank-explorer'
        NPM_REGISTRY = 'registry.npmjs.org'
        GITHUB_CRED = credentials('molgenis-jenkins-github-secret')
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
          sh "git config --global user.email git@molgenis.org"
          sh "git config --global user.name ${env.GITHUB_CRED_USR}"
          sh "git remote set-url origin https://${env.GITHUB_CRED_PSW}@github.com/${ORG}/${APP_NAME}.git"

          sh "git checkout -f master"

          sh "npm version ${env.RELEASE_SCOPE}"
          sh "yarn build"

          sh "git push --tags origin master"

          sh "echo //${NPM_REGISTRY}/:_authToken=${env.NPM_TOKEN} > ~/.npmrc"

          sh "npm publish"
        }
      }
    }
  }
  post {
    // [ slackSend ]; has to be configured on the host, it is the "Slack Notification Plugin" that has to be installed
    success {
      notifySuccess()
    }
    failure {
      notifyFailed()
    }
  }
}

def notifySuccess() {
  slackSend(channel: '#releases', color: '#00FF00', message: 'JS-module-build is successfully deployed on https://registry.npmjs.org: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}')
}

def notifyFailed() {
  slackSend(channel: '#releases', color: '#FF0000', message: 'JS-module-build has failed: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}')
}
