# Best place to change this env variables is mhealth/settings/local_env.py file. It loads after this one specially to
# allow you manage env without touching project code.
import os

PRODUCTION = False
DEBUG = True if not 'PRODUCTION_ENV' in os.environ else False