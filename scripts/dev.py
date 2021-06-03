from bbmri_client import bbmri_session
from dotenv import dotenv_values 
config = dotenv_values(".env.local")

target = config['TARGET']
username = config["USERNAME"]
password = config["PASSWORD"]
externalNationalNodes = [{
    "national_node": 'DE',
    "source": 'https://directory.bbmri.de/api/'
},
{
    "national_node": 'NL',
    "source": 'https://catalogue.bbmri.nl/api/'
}]

bbmriSession = bbmri_session(url=target, nationalNodes=externalNationalNodes, username=username, password=password)
bbmriSession.update_external_entities()
bbmriSession.update_eric_entities()
