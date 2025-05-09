from dotenv import load_dotenv
import os
load_dotenv()

KUBIOS_USERNAME = os.getenv('KUBIOS_USERNAME')
PASSWORD = os.getenv('PASSWORD')