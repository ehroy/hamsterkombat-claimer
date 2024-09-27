const CryptoJS = require("crypto-js");
async function GenerateGameDataPayload(key,datagame) {
    try {
      const startTime = Date.now();
      const endTime = startTime + 45000;
      const gameTag = key
      const itemSettings = datagame
  
      let currentTime = startTime;
      let score = 100;
      const gameEvents = [];
  
      while (currentTime < endTime) {
        const timeIncrement =
          Math.floor(Math.random() * (2500 - 1500 + 1)) + 1500;
        currentTime += timeIncrement;
  
        if (currentTime >= endTime) break;
  
        const hookPosX = (Math.random() * (275 - 75) + 75).toFixed(3);
        const hookPosY = (Math.random() * (251 - 199) + 199).toFixed(3);
        const hookShotAngle = (Math.random() * 2 - 1).toFixed(3);
        const hookHitX = (Math.random() * (400 - 100) + 100).toFixed(3);
        const hookHitY = (Math.random() * (700 - 250) + 250).toFixed(3);
  
        let itemType, itemSize, points;
  
        const randomValue = Math.random();
        if (randomValue < 0.6) {
          const rewardItems = itemSettings.filter(
            (item) => item.type === "REWARD"
          );
          const selectedReward =
            rewardItems[Math.floor(Math.random() * rewardItems.length)];
          itemType = 1;
          itemSize = selectedReward.size;
          points = Math.min(selectedReward.rewardValueList[0], 10);
          score = Math.min(score + points, 200);
        } else if (randomValue < 0.8) {
          const trapItems = itemSettings.filter((item) => item.type === "TRAP");
          const selectedTrap =
            trapItems[Math.floor(Math.random() * trapItems.length)];
          itemType = 1;
          itemSize = selectedTrap.size;
          points = Math.min(Math.abs(selectedTrap.rewardValueList[0]), 20);
          score = Math.max(100, score - points);
        } else {
          const bonusItem = itemSettings.find((item) => item.type === "BONUS");
          if (bonusItem) {
            itemType = 2;
            itemSize = bonusItem.size;
            points = Math.min(bonusItem.rewardValueList[0], 15);
            score = Math.min(score + points, 200);
          } else {
            itemType = 0;
            itemSize = 0;
            points = 0;
          }
        }
  
        const eventData = `${currentTime}|${hookPosX}|${hookPosY}|${hookShotAngle}|${hookHitX}|${hookHitY}|${itemType}|${itemSize}|${points}`;
        gameEvents.push(eventData);
      }
      console.log(gameEvents)
      const payload = gameEvents.join(";");
      const encryptedPayload = encryptData(payload, gameTag);
  
      return [encryptedPayload,score]
    } catch (error) {
      this.log(`Error in getGameData: ${error.message}`, "error");
    }
  }
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
  
  function encryptAES256CBC(plainText, key, iv) {
    const iv = crypto.randomBytes(16);
    // Pastikan key adalah 256-bit (32-byte) dan IV adalah 128-bit (16-byte)
    if (key.length !== 32) {
      throw new Error('Key harus 256-bit (32-byte)');
    }
    if (iv.length !== 16) {
      throw new Error('IV harus 128-bit (16-byte)');
    }
  
    // Membuat cipher menggunakan AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
  
    // Mengenkripsi teks
    let encrypted = cipher.update(plainText, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
  
    return encrypted;
  }
(async()=>{
    const dataarray = [
        {
            "type": "BONUS",
            "speed": 80,
            "size": 60,
            "quantity": 1,
            "rewardValueList": [
                30
            ]
        },
        {
            "type": "TRAP",
            "speed": 150,
            "size": 30,
            "quantity": 2,
            "rewardValueList": [
                -10,
                -10
            ]
        },
        {
            "type": "REWARD",
            "speed": 100,
            "size": 70,
            "quantity": 2,
            "rewardValueList": [
                50,
                50
            ]
        },
        {
            "type": "TRAP",
            "speed": 100,
            "size": 50,
            "quantity": 1,
            "rewardValueList": [
                -20
            ]
        },
        {
            "type": "REWARD",
            "speed": 200,
            "size": 30,
            "quantity": 5,
            "rewardValueList": [
                10,
                10,
                10,
                10,
                10
            ]
        },
        {
            "type": "REWARD",
            "speed": 150,
            "size": 50,
            "quantity": 3,
            "rewardValueList": [
                25,
                25,
                25
            ]
        }
    ]
    const key = '6c36c95cb622eca1f8571a5a28ab507e'
    console.log(await GenerateGameDataPayload(key,dataarray))
})()