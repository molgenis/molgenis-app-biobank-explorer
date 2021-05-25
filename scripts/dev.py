#script-dev-only
from dotenv import dotenv_values 
config = dotenv_values(".env.local")
#script-dev-only

config['NODES'] = [{
    "country": 'NL',
    "source": 'https://catalogue.bbmri.nl/api/'
}] 