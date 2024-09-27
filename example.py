from tonsdk.contract.wallet import WalletVersionEnum, Wallets
from tonsdk.utils import bytes_to_b64str
from tonsdk.crypto import mnemonic_new

# Parameter untuk wallet
wallet_workchain = 0  # Workchain default untuk TON
wallet_version = WalletVersionEnum.v4r2  # Menggunakan versi wallet v3r2

# Generate mnemonic baru
wallet_mnemonics = 'achieve renew survey picture half seminar street leave welcome bird gossip stairs hub image world youth visa eye hammer solution nasty category canyon control'.split(" ")

# Membuat wallet berdasarkan mnemonic
_mnemonics, _pub_k, _priv_k, wallet = Wallets.from_mnemonics(
    wallet_mnemonics, wallet_version, wallet_workchain)
print(wallet.address.to_string())
# Buat pesan untuk inisialisasi wallet
query = wallet.create_init_external_message()
# Konversi pesan ke base64 untuk deployment
base64_boc = bytes_to_b64str(query["message"].to_boc(False))

# Menampilkan semua detail wallet
print(f"""
Mnemonic: {wallet_mnemonics}

Raw address: {wallet.address.to_string()}

Bounceable, url safe, user-friendly address: {wallet.address.to_string(True, True, True)}

Base64boc to deploy the wallet: {base64_boc}
""")
