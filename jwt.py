import secrets
# Generates a 64-character hex string (32 bytes)
# Suitable for HS256
secret = secrets.token_hex(32)
print(secret)
