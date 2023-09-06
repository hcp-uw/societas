import base64
import hashlib
import hmac
from Crypto.Cipher import AES
from Firebase.dbconn import *
from core import *
ROUTE = '/user/'

class Auth:
    def hash3(password, user): #https://github.com/JaakkoL/firebase-scrypt-python/blob/master/firebasescrypt/firebasescrypt.py
        n = 2 ** 14
        p = 1
        salt = user.password_salt
        cprint(salt)
        user_salt = base64.b64decode(salt)
        cprint(user_salt)
        salt_separator= base64.b64decode('Bw==')
        password = bytes(password, 'utf-8')

        derived_key = hashlib.scrypt(
            password=password,
            salt=user_salt + salt_separator,
            n=n,
            r=8,
            p=p,
        )

        key = derived_key[:32]
        iv = b'\x00' * 16
        nonce=b''
        crypter = AES.new(key, AES.MODE_CTR, initial_value=iv, nonce=nonce)
        sk = "wawILo40NkG69NfUuESYubil5/dQB4vccZFhqAz+SGHg6utWCOQyGR7qHxB6k8VgIRlKoIVFXcgtlrBztqLlWA=="
        signer_key = base64.b64decode(sk)

        result = crypter.encrypt(signer_key)


        password_hash = base64.b64encode(result).decode('utf-8')

        error_msg = f"""
        | email: {user.email} |
        | password tried: {password} |
        | generated hash: {password_hash} |
        | true hash: {user.password_hash} |
        | salt: {user.password_salt} |
        """

        return (hmac.compare_digest(password_hash, user.password_hash), error_msg)
    
    def getuser(email):
        for user in auth.list_users().iterate_all():
            if user.email == email:
                return user
        return False
    
    def login(request):
        if getcurr() is not None:
            return str(Status(False, "User already logged in."))
        email = request.form.get('email')
        pwd = request.form.get('password')
        for user in auth.list_users().iterate_all():
            if user.email == email:
                '''
                salt = base64.b64decode(user.password_salt)
                stored_hash = base64.b64decode(user.password_hash)
                encoded_hash = base64.b64decode(hash2(pwd, user.password_salt))'''
                correct, error = Auth.hash3(pwd, user)
                if correct:
                    setcurr(user.uid)
                    return str(Status(False, f'Successfully logged in {email}'))
                return str(Status(False, f'Password is incorrect. error: {error}'))
        return str(Status(False, f'User with email {email} does not exist.'))
        
    def register(request):
        if getcurr() is not None:
            return str(Status(False, "User already logged in."))
        
        email = request.form.get('email')

        if not email.endswith('@uw.edu'):
            return str(Status(False, f"{email} is not a valid UW email"))

        pwd = request.form.get('password')

        if len(pwd) < 6:
            return str(Status(False, 'Password must be at least 6 characters long.'))

        for user in auth.list_users().iterate_all():
            if user.email == email:
                return str(Status(False, 'Email already exists.'))

        user = auth.create_user(email=email, password=pwd)
        user = Auth.getuser(email)
        setcurr(user.uid)
        
        return str(Status(True, f'Successfully registered {email}. {user.password_salt}'))
        
        
    def logout():
        setcurr(None)
        return str(Status(True, "Successfully logged out."))
