import re

bbmri_nn_sync = open("./bbmri-nn-sync.py", "r")
bbmri_nn_sync_content = bbmri_nn_sync.read()

script = re.sub(r"(?<=#script-dev-only)([\w\W]+)(?=#script-dev-only)", '\n', bbmri_nn_sync_content)
script = re.sub(r"(?<=external_national_nodes = )([\w\W]+)(?=#script-nodes)", "${external_nodes} ", script )
script = re.sub(r"#script-dev-only", '', script)

print(script)