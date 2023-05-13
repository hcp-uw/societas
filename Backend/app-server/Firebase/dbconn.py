import os
import json
from firebase_admin import credentials, firestore, initialize_app, auth
from datetime import datetime as dt

cred = credentials.Certificate('Backend/res/key.json')

default_app = initialize_app(cred)

db = firestore.client()

def create(collection, new):
	try:
		coll = db.collection(collection)
		coll.add(new)
		return ("Success", True, 200)
	except Exception as e:
		return (f"Failed: {e}", False, 000)
	
def read(collection):
	try:
		coll = db.collection(collection)
		vals = {}
		for i in coll.stream():
			vals[i] = i.to_dict()
		return (vals, True, 200)
	except Exception as e:
		return (f"Failed: {e}", False, 000)

def update(collection, id, new):
	try:
		coll = db.collection(collection)
		coll.document(id).set(new)
		return ("Success", True, 200)
	except Exception as e:
		return (f"Failed: {e}", False, 000)

def delete(collection, id):
	try:
		coll = db.collection(collection)
		coll.document(id).delete()
		return ("Success", True, 200)
	except Exception as e:
		return (f"Failed: {e}", False, 000)
