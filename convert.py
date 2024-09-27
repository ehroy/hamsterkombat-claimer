import base64
import hashlib
import binascii

def convert_base64_urlsafe_to_hex_address(base64_address):
    try:
        # Pastikan panjang alamat Base64 cocok dengan 44 karakter
        if len(base64_address) % 4 != 0:
            base64_address += '=' * (4 - len(base64_address) % 4)

        # Decode dari Base64 URL-safe ke bytes
        address_with_checksum = base64.urlsafe_b64decode(base64_address)

        # Pisahkan checksum (4 byte terakhir)
        address_bytes = address_with_checksum[:-4]
        checksum_received = address_with_checksum[-4:]

        # Validasi checksum
        checksum_calculated = hashlib.sha256(hashlib.sha256(address_bytes).digest()).digest()[:4]
        if checksum_received != checksum_calculated:
            raise ValueError("Checksum tidak valid!")

        # Pisahkan workchain (1 byte pertama) dan address
        workchain_byte = address_bytes[0]
        workchain = int.from_bytes([workchain_byte], byteorder='big', signed=True)
        address_hex = binascii.hexlify(address_bytes[1:]).decode('utf-8')

        # Gabungkan workchain dan hexadecimal address
        hex_address = f'{workchain}:{address_hex}'
        return hex_address
    except Exception as e:
        print(f"Error: {e}")
        return None

# Contoh penggunaan
base64_address = 'UQAKE8Nigy4fouO5QdgXu_ygKShGYzHAZWy41q6KBokkIlGBke'  # Ganti dengan alamat base64 TON
hex_address = convert_base64_urlsafe_to_hex_address(base64_address)

print("Alamat dalam format hexadecimal TON:", hex_address)
