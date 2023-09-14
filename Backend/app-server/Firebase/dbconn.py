import os
import json
from firebase_admin import credentials, firestore, initialize_app, auth
from datetime import datetime as dt

path = './res/key.json'
if os.getcwd().endswith('app-server'):
	path = './../res/key.json'
if os.getcwd().endswith('Firebase'):
	path = './../../res/key.json'
cred = credentials.Certificate(path)

default_app = initialize_app(cred)

db = firestore.client()

def create(collection, new):
	try:
		coll = db.collection(collection)
		ut, ref = coll.add(new)
		return (f"{ref.id}", True, 200)
	except Exception as e:
		return (f"Failed: {e}", False, 000)
	
def read(collection):
	try:
		coll = db.collection(collection)
		vals = {}
		for i in coll.stream():
			vals[i.id] = i.to_dict()
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

def getIDFromIdentifier(collection, identifier, value):
	vals = read(collection)
	for id, doc in vals.items():
		for key, val in doc.items():
			if (key == identifier):
				if (value == val):
					return id
			break
