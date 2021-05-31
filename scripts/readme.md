# Scripts folder

## Development

### Create a virtual enviroment
Open only the scripts folder in VSCode

open a terminal

type:
```
python3 -m venv env
```

### Activate the environment in VSCode
You may need to restart VSCode
Now you can select the env when clicking on the bottom on Python
(or you see already Python 3.9.5 ('env':venv))

### Activate environment in the terminal and install requirements

type:

```
source ./env/bin/activate
```

type:

```
pip install -r requirements.txt
```

### return to terminal (when done):
exit() or deactivate

## Environment variables for local development

create a .env.local file with

TARGET = %url to your target%
SOURCE = %url to your source%
USERNAME = username for account on target
PASSWORD = password for account on target

### Update requirements.txt

If you need to update the requirements.txt type in the repl:

```
pip freeze > requirements.txt
```

## Usage in molgenis scripts plugin
Make sure you have access to the bbmri_client script on your server / vm / docker

Open de scripts plugin on you Molgenis instance.
Fill in the example with your own code


e.g:

```
from bbmri_client import bbmri_session

bbmriSession = bbmri_session(url=target, national_nodes=externalNationalNodes, token=${molgenisToken})
bbmriSession.update_external_entities()

```

**example arguments:**

url=https://yourserverurl.com

national_nodes can be either a list of dictionaries of a single dictionary with the following format:

```
externalNationalNodes = [{
    "national_node": 'NL',
    "source": 'https://yoursourceurl.com'
}]

```

*if you use an older molgenis py client:*
add /api/ after source and target url.