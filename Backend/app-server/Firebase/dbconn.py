import os
import json
from firebase_admin import credentials, firestore, initialize_app
from datetime import datetime as dt

cred = credentials.Certificate('Backend/res/key.json')

default_app = initialize_app(cred)

db = firestore.client()

userdb = db.collection('Users')

def create(id: str):
	try:
		userdb.add(
			{"created":dt.now(), "email": "e123@uw.edu", "username":"D3"}
		)
	except Exception as e:
		return (f"Failed: {e}", False, 000)

create('Users')
