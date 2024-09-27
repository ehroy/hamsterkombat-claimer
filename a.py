import nacl.signing
import nacl.encoding
import base64
from tonsdk.contract.wallet import WalletVersionEnum, Wallets
from tonsdk.utils import bytes_to_b64str
from tonsdk.crypto import mnemonic_new
import time
import nacl.signing
import nacl.encoding
import json
import base64
# Mendapatkan jumlah milidetik yang telah berlalu sejak epoch Unix
timestamp_milliseconds = int(time.time() * 1000)


# Parameter untuk wallet
wallet_workchain = 0  # Workchain default untuk TON
wallet_version = WalletVersionEnum.v4r2  # Menggunakan versi wallet v3r2

# Generate mnemonic baru
wallet_mnemonics = 'jar loan motion differ lottery reopen token decade legend nose leave onion zebra rate surface short reform dawn bracket mix shoulder execute intact autumn'.split(" ")

# Membuat wallet berdasarkan mnemonic
_mnemonics, _pub_k, _priv_k, wallet = Wallets.from_mnemonics(
    wallet_mnemonics, wallet_version, wallet_workchain)

# Menampilkan public key dalam hexadecimal format
pub_key_hex = _pub_k.hex()  # Konversi public key ke hexadecimal
print(f"Public Key (Hex): {pub_key_hex}")

# Buat pesan untuk inisialisasi wallet
query = wallet.create_init_external_message()

# Konversi pesan ke base64 untuk deployment
base64_boc = bytes_to_b64str(query["message"].to_boc(False))

# Ekstrak hanya 32 byte pertama dari _priv_k (jika diperlukan)
seed = _priv_k[:32]  # Mengambil 32 byte pertama sebagai seed

# Gunakan seed ini untuk membuat signing key
signing_key = nacl.signing.SigningKey(seed)

# data_string = f"payload-{timestamp_milliseconds}"

# # Konversi string ke byte array
# data_bytes = data_string.encode('utf-8')
# print(data_bytes)
# # Sign pesan menggunakan private key
# signed_message = signing_key.sign(data_bytes)  # Menandatangani pesan
# signature_base64 = base64.b64encode(signed_message.signature).decode()  # Konversi signature ke Base64

# Menampilkan semua detail wallet
data = json.dumps({"manifestUrl":"https://telegram.blum.codes/tonconnect-manifest.json","items":[{"name":"ton_addr"},{"name":"ton_proof","payload":int(time.time())*1000}]})

# Serialize data to JSON string
data_json = json.dumps(data, separators=(',', ':'))

# Sign the data
signed = signing_key.sign(data.encode('utf-8'))

# Signature in Base64 format
signature_base64 = base64.b64encode(signed.signature).decode('utf-8')

# Print the signature
print(f"Signature (Base64): {signature_base64}")

print(f"""
Mnemonic: {wallet_mnemonics}

Raw address: {wallet.address.to_string()}

Bounceable, url safe, user-friendly address: {wallet.address.to_string(True, True, True)}

Base64boc to deploy the wallet: {base64_boc}

Signature (Base64): {signature_base64}
""")
import requests

headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNfZ3Vlc3QiOmZhbHNlLCJ0eXBlIjoiQUNDRVNTIiwiaXNzIjoiYmx1bSIsInN1YiI6IjNhZjllN2VkLWUzMTktNDYzYi04NWIyLWUyY2EyZDIwYWExMCIsImV4cCI6MTcyNjY4NjA4MiwiaWF0IjoxNzI2NjgyNDgyfQ.yC6bpHOTKpv6jeRkFB3-u1coJqQ9MaC2hsLPN4jUNvQ',
    'content-type': 'application/json',
    'lang': 'en',
    'origin': 'https://telegram.blum.codes',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
}

json_data = {
    'account': {
        'address': wallet.address.to_string(),
        'chain': '-239',
        'publicKey': pub_key_hex,
    },
    'tonProof': {
        'name': 'ton_proof',
        'proof': {
            'domain': {
                'lengthBytes': 19,
                'value': 'telegram.blum.codes',
            },
            'payload': str(timestamp_milliseconds),
            'signature': signature_base64,
            'timestamp': int(time.time()),
        },
    },
}
print(json_data)

response = requests.post('https://wallet-domain.blum.codes/api/v1/wallet/connect', headers=headers, json=json_data)
print(response.json())