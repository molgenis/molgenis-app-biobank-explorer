from bbmri_client import bbmri_session
from dotenv import dotenv_values 
config = dotenv_values(".env.local")

target = config['TARGET']
username = config["USERNAME"]
password = config["PASSWORD"]
externalNationalNodes = [{
    "national_node": 'NL',
    "source": 'https://catalogue.bbmri.nl/api/'
}]

bbmriSession = bbmri_session(url=target, national_nodes=externalNationalNodes, username=username, password=password)
bbmriSession.update_external_entities()
