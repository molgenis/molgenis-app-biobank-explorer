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

## Using scripts in molgenis scripts plugin
Copy the scripts content in the molgenis scripts plugin in your browser

remove username/password and add token=${molgenisToken} in the session code. Make sure the switch is on for molgenis token in the scripts

e.g:

```
targetSession = Session(url=target, token=${molgenisToken})

```