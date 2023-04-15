import os
import json
from firebase_admin import credentials, firestore, initialize_app
from datetime import datetime as dt

cred = credentials.Certificate('../../res/key.json')

default_app = initialize_app(cred)

db = firestore.client()

societasdb = db.collection('Societas')

def create(id: str, doc):
	try:
		societasdb.document(id).set((doc))
		return ("Success", True, 200)
	except Exception as e:
		return (f"Failed: {e}", False, 000)

n = create('Users', {"Created":dt.now(), "Email": "e@uw.edu", "ID": 1, "Username":"D2"})
print(n)
