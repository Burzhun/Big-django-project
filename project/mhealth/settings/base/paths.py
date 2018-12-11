# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import sys 

PROJECT_DIR = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
BASE_DIR = os.path.realpath(os.path.dirname(PROJECT_DIR))
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))