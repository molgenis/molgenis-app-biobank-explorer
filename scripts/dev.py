from bbmri_client import BBMRISession
from dotenv import dotenv_values 
config = dotenv_values(".env.local")

target = config['TARGET']
username = config["USERNAME"]
password = config["PASSWORD"]
external_national_nodes = [{
    "national_node": 'DE',
    "source": 'https://directory.bbmri.de/api/'
},
{
    "national_node": 'NL',
    "source": 'https://catalogue.bbmri.nl/api/'
}]

bbmriSession = BBMRISession(url=target, national_nodes=external_national_nodes, username=username, password=password)
# bbmriSession.update_external_entities()
bbmriSession.update_eric_entities()
