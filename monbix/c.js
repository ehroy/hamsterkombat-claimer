const CryptoJS = require("crypto-js"); // Pastikan Anda sudah menginstal CryptoJS

function encryptData(plaintext, key) {
  // Generate a random 12-byte (96-bit) IV and convert it to Base64
  const iv = CryptoJS.lib.WordArray.random(12).toString(CryptoJS.enc.Base64);

  // Encrypt the plaintext using AES with the given key and IV
  const encrypted = CryptoJS.AES.encrypt(
    plaintext,
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(iv), // Use the random IV for encryption
    }
  );

  // Combine IV and ciphertext, both in Base64 format, and return the result
  return iv + encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function decryptData(encryptedData, key) {
    const iv = encryptedData.slice(0, 16); // First 16 characters for IV (Base64)
    const ciphertext = encryptedData.slice(16); // Remaining data is the ciphertext
  
    // Decode IV and ciphertext from Base64
    const decodedIv = CryptoJS.enc.Base64.parse(iv);
    const decodedCiphertext = CryptoJS.enc.Base64.parse(ciphertext);
    console.log(decodedCiphertext)
  
    // Decrypt using AES with the correct key and IV
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: decodedCiphertext },
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: decodedIv, // Use the decoded IV
        mode: CryptoJS.mode.CBC, // Ensure the mode is CBC
        padding: CryptoJS.pad.Pkcs7, // Use PKCS7 padding
      }
    );
  
    // Convert the WordArray result into a UTF-8 string
    const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted);
    return decryptedText
}

function generateEncryptedPayload(dataArray, encryptionKey) {
  // Langkah 1: Ubah setiap elemen numerik di array menjadi string dengan format yang diinginkan
  const formattedData = dataArray
    .map((innerArray) => {
      return (
        innerArray
          .map((value) => {
            // Jika elemen numerik dan bukan bilangan bulat, bulatkan ke 3 tempat desimal
            return Number.isFinite(value) && value % 1 !== 0
              ? value.toFixed(3)
              : value;
          })
          // Gabungkan elemen-elemen dalam array bagian dalam dengan "|"
          .join("|")
      );
    })
    // Gabungkan elemen-elemen dari array utama dengan ";"
    .join(";");

  // Langkah 2: Enkripsi hasil string dengan menggunakan kunci enkripsi
  const encryptedPayload = encryptData(formattedData, encryptionKey);

  // Mengembalikan hasil enkripsi
  return encryptedPayload;
}

// Contoh penggunaan
const encryptionKey = "70f254bf069d20ca9328b81ae3ff54ae"; // Ganti dengan kunci yang sesuai
const dataArray = [[1, 2.456, 3]]; // Contoh data
const encryptedPayload = 'IM0I50/U86UV0VFx8G+dB2cCBXS7UhDZPVxc20Hznskng7VSJXY6PrkxqYLyLVhvRt/3SoX73ximOWMzhUgg06WoHXrg1VaZ2VwWGWDB8WyTcXgedEXfzQvczPmxnJJZGGNbNTJOAC7cUcnceMzxiNpmsa0rTuGikhHz2fewv1LX6kPk3songFjRWPCR0xGxICtZsEpn5speNSVWbXBW/L7otFR73iHp45sYZ4zqP/BE8f1RFDPGW9od/vEELWfRQilUXO4CtR0h53V1fuWR8PrOiAJZE5aZsf/7d7pVBMrRgqnJUeksvOU455ux2wWRfvBTy3vxPaJimc7whWsw6G04C9AgVhtMz8s2gSKDDvGF4bnC1pUDoSsamjQY7Jomj6/O0AM91yC9G8+A+ft9YbHILJhlF3UjfwZBx7A5JUzQHyEOUGG+UuwuKnyBfiF/M1GpsJAyc0u4jWUbmKGxZm5Ywo/PM73SKUNJevYwCLZiryJ/68WicPHyThmJQNoWJWDUKwz+TPbLSEvmOtryu8omfYtXymkieMkunJTXnhNug727WU5ojwj6/Ji3oA8lnFXWYM/gmcC9binVh4OFj+COkTE8F0Iu/BRHC6WgeP3VAtPRmeodsffl/BtFsGLtu/wZQUY/BCffTHFuOsdb+OtpIu9BRvrf7y5V+Q=='
const decryptedPayload = decryptData(encryptedPayload, encryptionKey);

let total = 0
console.log("Decrypted:", decryptedPayload);
