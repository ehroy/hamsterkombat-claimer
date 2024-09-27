from tonsdk.contract.wallet import Wallets
from nacl.signing import SigningKey
from nacl.encoding import HexEncoder
import json

# Contoh mnemonic dari TON wallet (seed phrase)
mnemonic = 'truth abuse neutral festival rebuild grid hip crystal purchase media cause myself devote toe rookie peanut awesome cherry alone magnet indoor hawk horror elegant'.split(" ")  # Ganti dengan seed phrase Anda

# Buat wallet dari mnemonic
wallet = Wallets.from_mnemonics(mnemonic)

# Ambil private key dari wallet
private_key_hex = wallet.keys['private']  # Private key dalam format hex

# Konversi private key dari hex ke byte
private_key_bytes = bytes.fromhex(private_key_hex)

# Buat SigningKey dari private key
signing_key = SigningKey(private_key_bytes)

# Payload yang ingin Anda tandatangani (misalnya, data yang dikirim dari server)
payload_data = {
    "ton_addr": wallet.address.to_string(),
    "timestamp": "1726449899828"  # contoh payload
}

# Ubah payload menjadi format JSON string
payload = json.dumps(payload_data).encode()

# Tanda tangani payload menggunakan private key
signature = signing_key.sign(payload)

# Convert signature ke format hexadecimal
ton_proof_signature = signature.signature.hex()

print(f"TON Proof Signature: {ton_proof_signature}")
