from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.hazmat.backends import default_backend
import base64
import os
import scrypt
from Firebase.dbconn import *
from core import *
ROUTE = '/user/'

def hashpwd(password, salt):
    # Convert base64-encoded parameters to byte arrays
    signer_key = base64.b64decode("wawILo40NkG69NfUuESYubil5/dQB4vccZFhqAz+SGHg6utWCOQyGR7qHxB6k8VgIRlKoIVFXcgtlrBztqLlWA==")
    salt_separator = base64.b64decode("Bw==")
    
    # Concatenate salt separator and salt value
    salted = salt_separator + salt.encode('utf-8')
    
    # Hash password with SCRYPT algorithm
    kdf = Scrypt(
        salt=salted,
        length=32,
        n=2 ** 8,
        r=8,
        p=14,
        backend=default_backend(),
    )
    key = kdf.derive(password.encode())
    
    # Store salt and hashed password in database
    stored_password = base64.b64encode(salt.encode('utf-8') + key).decode()
    return stored_password

def hash2(password, salt):
    salt_separator = base64.b64decode('Bw==')
    salt = salt.encode('utf-8') + salt_separator
    hash_params = {"N": 2**14, "r": 8, "p": 1}
    return base64.b64encode(scrypt.hash(password.encode('utf-8'), salt=salt, **hash_params)).decode()

class Auth:
    def login(request):
        if getcurr() is not None:
            return str(Status(False, "User already logged in."))
        email = request.args.get('email')
        pwd = request.args.get('password')
        for user in auth.list_users().iterate_all():
            if user.email == email:
                salt = base64.b64decode(user.password_salt)
                stored_hash = base64.b64decode(user.password_hash)
                encoded_hash = base64.b64decode(hash2(pwd, user.password_salt))
                if encoded_hash == stored_hash:
                    setcurr(user.uid)
                    return str(Status(False, f'Successfully logged in {email}'))
                return str(Status(False, f'Password is incorrect. actual: {user.password_hash}. passed: {base64.b64encode(encoded_hash).decode()}'))
        return str(Status(False, f'User with email {email} does not exist.'))
        
    def register(request):
        if getcurr() is not None:
            return str(Status(False, "User already logged in."))
        
        email = request.args.get('email')

        if not email.endswith('@uw.edu'):
            return str(Status(False, f"{email} is not a valid UW email"))

        pwd = request.args.get('password')

        if len(pwd) < 6:
            return str(Status(False, 'Password must be at least 6 characters long.'))

        for user in auth.list_users().iterate_all():
            if user.email == email:
                return str(Status(False, 'Email already exists.'))

        user = auth.create_user(email=email, password=pwd)

        setcurr(user.uid)
        
        return str(Status(True, f'Successfully registered {email}.'))
        
        
    def logout():
        setcurr(None)
        return str(Status(True, "Successfully logged out."))
