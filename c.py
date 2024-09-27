import base64

# Data signature dalam format base64
signature_base64 = "kTDuiM7qe9ClIWFcIcHssNiv5eeQnBr0HAJ7efB0d7gQ7lbxtTCliaWbdAkZaxtdbCHeCc+sdlb3uA4F2FA6Bg=="

# Decode dari base64 ke binary
signature_bytes = base64.b64decode(signature_base64)

# Konversi dari binary ke string (jika data asli adalah string, sesuaikan encoding)
# Misalnya, jika data asli adalah string yang di-encode dengan utf-8
signature_string = signature_bytes.decode('utf-8')

print("Signature dalam format string:", signature_string)
