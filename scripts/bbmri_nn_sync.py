from bbmri_client import bbmri_session
from dev import config

target = config['TARGET']
username = config["USERNAME"]
password = config["PASSWORD"]
externalNationalNodes = config['NODES']

bbmriSession = bbmri_session(url=target, national_nodes=externalNationalNodes, username=username, password=password)
bbmriSession.update_external_entities()
