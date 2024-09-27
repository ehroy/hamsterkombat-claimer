const crypto = require('crypto');
const fs = require("fs");
const fetch = require("node-fetch");
const { HttpsProxyAgent } = require("https-proxy-agent");
const chalk = require("chalk");
const delay = require("delay");
const BASEURL = "https://www.binance.com/bapi/growth/v1/friendly/growth-paas";
const queryFilePath = "mon.txt";
const axios = require('axios');
const turbo = true
function encryptAES256CBC(plainText, key) {
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
  let encrypted = cipher.update(plainText, 'utf-8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
}
async function generateData(dataObject, isFast) {
  const gameTag = dataObject.data.gameTag;

  // Filter out items where type is not "TRAP"
  const cryptoItems = dataObject.data.cryptoMinerConfig.itemSettingList.filter(
    (item) => item.type !== "TRAP"
  );

  let resultString = "";
  let itemCount = 0;

  // Calculate total score by summing up all reward values
  const totalScore = cryptoItems.reduce((total, item) => {
    return total + item.rewardValueList.reduce((sum, value) => sum + value, 0);
  }, 0);

  for (const item of cryptoItems) {
    for (const rewardValue of item.rewardValueList) {
      const timestamp = Date.now();
      const randomValue1 = (Math.random() * 209 + 130).toFixed(3);
      const randomValue2 = (Math.random() * 49 + 200).toFixed(3);
      const randomValue3 = (Math.random() * 2 - 1).toFixed(3);
      const randomValue4 = (Math.random() * 137 + 112).toFixed(3);
      const randomValue5 = (Math.random() * 249 + 250).toFixed(3);

      const typeValue = item.type === "REWARD" ? 1 : 2;
      const sizeValue = item.size;
      const bonusValue =
        item.type === "BONUS"
          ? item.size + item.rewardValueList[0]
          : (Math.random() * 198 + 1).toFixed(0);

      // Concatenate the values into the result string
      resultString += `${timestamp}|${randomValue1}|${randomValue2}|${randomValue3}|${randomValue4}|${randomValue5}|${typeValue}|${sizeValue}|${bonusValue}`;

      itemCount++;

      // Add semicolon if it's not the last item
      if (
        itemCount <
        cryptoItems.reduce(
          (count, currentItem) => count + currentItem.rewardValueList.length,
          0
        )
      ) {
        resultString += ";";
      }

      // Wait for a delay based on `isFast` flag
      await delay(4000);
    }
  }

  const finalData = {
    data: resultString,
    gameTag: gameTag,
    score: totalScore,
  };

  return finalData;
}

function readQueryIdsFromFile() {
  try {
    const queryContent = fs.readFileSync(queryFilePath, "utf-8");
    return queryContent
      .split("\n")
      .map((query) => query.trim())
      .filter((query) => query); // Ensure to remove extra newlines or spaces
  } catch (error) {
    console.error(chalk.red(`Error reading ${queryFilePath}:`), error);
    return [];
  }
}
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

    const payload = gameEvents.join(";");
    const encryptedPayload = encryptData(payload, gameTag);

    return [encryptedPayload,score]
  } catch (error) {
    this.log(`Error in getGameData: ${error.message}`, "error");
  }
}
async function generateGameDataForRewards(inputRewards) {
    const rewardData = [],
      currentTime = Date.now(),
      filteredRewards = inputRewards.filter(
        (reward) => reward.type === "REWARD" || reward.type === "BONUS"
      ),
      rewardList = [];
  
    // Process rewards and add to the list
    filteredRewards.forEach((reward) => {
      for (let i = 0; i < reward.quantity; i++) {
        const rewardValue =
          reward.rewardValueList[
            Math.floor(Math.random() * reward.rewardValueList.length)
          ];
        rewardList.push({
          type: reward.type,
          size: reward.size,
          value: rewardValue,
        });
      }
    });
    // console.log(rewardList)
    const totalRewards = rewardList.length,
      maxRewardsToGenerate = Math.min(45, totalRewards); // Limit to 45 
    //   console.log(maxRewardsToGenerate)
    let totalValue = 0;
  
    // Loop to generate rewards
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * rewardList.length),
        selectedReward = rewardList[randomIndex],
  
        rewardEntry = [];
        // console.log(selectedReward)
      await delay(5000);
      // Fill the reward data
      rewardEntry[0] = Date.now(); // Reward timestamp
      rewardEntry[1] = Math.random() * 399;
      rewardEntry[2] = Math.random() * 466;
      rewardEntry[3] = Math.random() * 2;
      rewardEntry[4] = Math.random() * 450;
      rewardEntry[5] = Math.random() * 500;
      rewardEntry[6] = rewardList[i].type === "REWARD" ? 1 : 2; // Type of reward
      rewardEntry[7] = rewardList[i].size; // Size of reward
      rewardEntry[8] = Math.round(Math.random() * 200); // Value of reward
  
      totalValue += selectedReward.size; // Accumulate total reward value
      rewardData.push(rewardEntry); // Add entry to the list
    }
  

  
    return [rewardData, totalValue,rewardList];
  }
  function calculateTotal(data, validation) {
    let totalValue = 0;
  
    // Iterasi melalui setiap item di data
    data.forEach(item => {
      const size = item[7]; // Ambil elemen ke-7 dari array (ukuran)
      
      // Temukan objek validasi yang sesuai berdasarkan ukuran
      const match = validation.find(v => v.size === size);
      
      // Jika ada kecocokan, tambahkan nilai (value) ke totalValue
      if (match) {
        totalValue += match.value;
      }
    });
  
    return totalValue;
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
async function GeneratePayload(url, body = null, headers = {}, proxy = null) {
  const queryString = new URLSearchParams(body).toString();
  console.log(queryString)
  return new Promise((resolve, reject) => {
    // Tentukan opsi untuk fetch
    const options = {
      method:  "GET",
    };

    // Jika proxy disediakan, atur agent
    if (proxy) {
      options.agent = new HttpsProxyAgent(proxy);
    }

    fetch(url+queryString, options)
      .then((response) => {
        // Validasi status response
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data)) // Resolving the promise with data
      .catch((error) => {
        console.error("Error:", error);
        reject(error); // Rejecting the promise with error
      });
  });
}
async function makeRequest(url, body = null, headers = {}, proxy = null) {
  return new Promise((resolve, reject) => {
    // Tentukan opsi untuk fetch
    const options = {
      method: body ? "POST" : "GET",
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "Content-Type": "application/json",
        Origin: "https://www.binance.com",
        Referer: "https://www.binance.com/vi/game/tg/moon-bix",
        "Sec-Ch-Ua":
          '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        ...headers,
      },
      body: body ? body : undefined,
    };

    // Jika proxy disediakan, atur agent
    if (proxy) {
      options.agent = new HttpsProxyAgent(proxy);
    }

    fetch(url, options)
      .then((response) => {
      
        return response.json();
      })
      .then((data) => resolve(data)) // Resolving the promise with data
      .catch((error) => {
        console.error("Error:", error);
        reject(error); // Rejecting the promise with error
      });
  });
}
async function gameData(data) {
  try {
      const response = await axios.get('https://moonbix-server-9r08ifrt4-scriptvips-projects.vercel.app/moonbix/api/v1/play', {
          params: { game_response: data },
          timeout: this.timeout * 1000,
      });

      if (response.data.message === 'success') {
          
          return response.data.game
      }

      console.log(response.data.message, 'warning');
      return false;
  } catch (error) {
      console.log(`Error receiving game data: ${error.message}`, 'error');
      return false;
  }
}

async function processChunkedData(queryIds, chunkSize = 20) {
  for (let i = 0; i < queryIds.length; i += chunkSize) {
    const chunk = queryIds.slice(i, i + chunkSize); // Ambil chunk data dengan batasan 20 item
    const promises = chunk.map(async (query, index) => {
      try {
        console.log(chalk.yellow(`➤ Processing Account No-${index + 1} ⚡`));
      const bearerToken = await makeRequest(
        BASEURL + "/third-party/access/accessToken",
        JSON.stringify({ queryString: query, socialType: "telegram" }),
        {},
        `http://brd-customer-hl_7da2a2da-zone-zone6-country-us-session-${
          (1000000 * Math.random()) | 0
        }:5omkljmze92i@zproxy.lum-superproxy.io:22225`
      );
      if (bearerToken.code === "000000") {
        console.log(chalk.yellow(`➤ Processing Get Token Access`));
        const access_token = bearerToken.data.accessToken;
        let user

        do {
         
          user = await makeRequest(
            BASEURL + "/mini-app-activity/third-party/user/user-info",
            JSON.stringify({ resourceId: 2056 }),
            { "X-Growth-Token": access_token },
            `http://brd-customer-hl_7da2a2da-zone-zone6-country-us-session-${
              (1000000 * Math.random()) | 0
            }:5omkljmze92i@zproxy.lum-superproxy.io:22225`
          );
          if(!user.data.userId){
            console.log(chalk.yellow(`➤ Processing Account Not Register`));
            console.log(chalk.yellow(`➤ Processing Start For Regist`));
            const RegisterUser = await makeRequest(
              "https://www.binance.com/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/referral",
              JSON.stringify({"resourceId":2056,"agentId":"992405684"}),
              { "X-Growth-Token": access_token },
              `http://brd-customer-hl_7da2a2da-zone-zone6-country-us-session-${
                (1000000 * Math.random()) | 0
              }:5omkljmze92i@zproxy.lum-superproxy.io:22225`
            );
            const Participan = await makeRequest(
              "https://www.binance.com/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/game/participated",
              JSON.stringify({"resourceId":2056}),
              { "X-Growth-Token": access_token },
              `http://brd-customer-hl_7da2a2da-zone-zone6-country-us-session-${
                (1000000 * Math.random()) | 0
              }:5omkljmze92i@zproxy.lum-superproxy.io:22225`
            );
          }
        } while (!user.data.userId);
        
        if (user.data.qualified) {
          let playGame =
            user.data.metaInfo.totalAttempts -
            user.data.metaInfo.consumedAttempts;
          console.log(chalk.yellow(`➤ User ${user.data.userId}`));
          console.log(chalk.yellow(`➤ Play Game Found ${playGame}`));
          console.log(chalk.yellow(`➤ Point ${user.data.metaInfo.totalGrade}`));
          console.log(chalk.yellow(`➤ Checking Task`));
          if(playGame > 2){
          const ListTask = await makeRequest(
            "https://www.binance.com/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/task/list",
            JSON.stringify({ resourceId: 2056 }),
            { "X-Growth-Token": access_token },
            `http://brd-customer-hl_7da2a2da-zone-zone6-country-us-session-${
              (1000000 * Math.random()) | 0
            }:5omkljmze92i@zproxy.lum-superproxy.io:22225`
          );
          if(ListTask.code === '000000'){
              const validasiTask = ListTask.data.data[0].taskList.data
              const dataComplete = validasiTask.map(async (element) => {
                if(element.status === 'IN_PROGRESS'){
                  const complete = await makeRequest(
                    "https://www.binance.com/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/task/complete",
                    JSON.stringify({"resourceIdList":[element.resourceId],"referralCode":null}),
                    { "X-Growth-Token": access_token },
                    `http://brd-customer-hl_7da2a2da-zone-zone6-country-us-session-${
                      (1000000 * Math.random()) | 0
                    }:5omkljmze92i@zproxy.lum-superproxy.io:22225`
                  );
                  if(complete.code.data === null){
                    console.log(chalk.green(`➤  Task Complete Resource [${element.resourceId}] status [${complete.data.status}]`));
                  }else{
                    console.log(chalk.red(`➤  Task Not Complete [${element.resourceId}]`));
                  }
                }
              });
              await Promise.all(dataComplete)
          }else{
            console.log(chalk.red(`➤ Processing Get Task Failed !!!`));
          }
          
            const start = await makeRequest(
              BASEURL + "/mini-app-activity/third-party/game/start",
              JSON.stringify({ resourceId: 2056 }),
              { "X-Growth-Token": access_token },
              `http://brd-customer-hl_7da2a2da-zone-zone6-country-us-session-${
                (1000000 * Math.random()) | 0
              }:5omkljmze92i@zproxy.lum-superproxy.io:22225`
            );
            if (start.code === "000000") {
              console.log(chalk.yellow(`➤ Processing Play Game 🎮🎮`));
              const Play = await makeRequest(
                BASEURL + "/mini-app-activity/third-party/game/start",
                JSON.stringify({ resourceId: 2056 }),
                { "X-Growth-Token": access_token },
                `http://brd-customer-hl_7da2a2da-zone-zone6-country-us-session-${
                  (1000000 * Math.random()) | 0
                }:5omkljmze92i@zproxy.lum-superproxy.io:22225`
              );
              // console.log(Play);
              // const [rewardData, totalValue] = await GenerateGameDataPayload(
              //   Play.data.gameTag,
              //   Play.data.cryptoMinerConfig.itemSettingList
              // );
              // console.log(Play)
              if(Play.code === '000000'){
              //  console.log(JSON.stringify(Play))
              const GetPayloadAPi = await generateData(Play,turbo)
              console.log(GetPayloadAPi)
              let previousTime = Date.now();
              const encryptedPayload = encryptAES256CBC(GetPayloadAPi.data, GetPayloadAPi.gameTag);
              console.log(encryptedPayload)
              let currentTime = Date.now();
              await delay(45000);
                const Complete = await makeRequest(
                BASEURL + "mini-app-activity/third-party/game/complete",
                JSON.stringify({
                  resourceId: 2056,
                  payload: encryptedPayload,
                  log: GetPayloadAPi.gameTag,
                }),
                { "X-Growth-Token": access_token },
                `http://brd-customer-hl_7da2a2da-zone-zone6-country-us-session-${
                  (1000000 * Math.random()) | 0
                }:5omkljmze92i@zproxy.lum-superproxy.io:22225`
              );
              console.log(Complete)
              if (Complete.success) {
                console.log(
                  chalk.yellow(`➤ Processing Play Game Success 🎮🎮`)
                );
              } else {
                console.log(chalk.yellow(`➤ Processing Play Game Failed !!`));
              }
            }else{
              console.log(chalk.red(`➤ Processing generate payload failed !!`));
             
            }
            } else {
              console.log(chalk.yellow(`➤ Processing Play Game Failed !!`));
            }
          
          console.log(
            chalk.magenta(`➤ Processing Account Couldown 10 menit !!`)
          );
         
        } else {
          console.log(chalk.red(`➤ Processing Skip Play Game !!`));
        }
      }else{
        console.log(chalk.red(`➤ Processing Account Banned Skip !!`));
      }

      } else {
        console.log(chalk.red(`➤ Processing Get Token Access Failed`));
      }
      } catch (error) {
        console.log(chalk.red(`➤ Processing ${error.toString()}`));
      }
    });


    await Promise.all(promises); // Tunggu sampai semua promise dalam chunk selesai
    console.log(chalk.blue(`Chunk ${i / chunkSize + 1} completed.`));
    await delay(5000); // Delay 5 detik sebelum memproses chunk berikutnya (opsional)
  }
}

(async () => {
  const queryIds = readQueryIdsFromFile();
  if (queryIds.length === 0) {
    console.error(chalk.red("No query_ids found in query.txt"));
    return;
  }

  while(true){
    await processChunkedData(queryIds, 20);
    console.log(
      chalk.magenta(`➤ Processing Account Couldown 10 menit !!`)
    );
    await delay(60000 * 10);
  }
})();