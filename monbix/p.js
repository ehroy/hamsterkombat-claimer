const CryptoJS = require("crypto-js");


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
    console.log(rewardList)
    const totalRewards = rewardList.length,
      maxRewardsToGenerate = Math.min(45, totalRewards); // Limit to 45 
      console.log(maxRewardsToGenerate)
    let totalValue = 0;
  
    // Loop to generate rewards
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * rewardList.length),
        selectedReward = rewardList[randomIndex],
  
        rewardEntry = [];
        console.log(selectedReward)
    //   await delay(4000);
      // Fill the reward data
      rewardEntry[0] = Date.now(); // Reward timestamp
      rewardEntry[1] = Math.random() * 399;
      rewardEntry[2] = Math.random() * 466;
      rewardEntry[3] = Math.random() * 2;
      rewardEntry[4] = Math.random() * 600;
      rewardEntry[5] = Math.random() * 600;
      rewardEntry[6] = rewardList[i].type === "REWARD" ? 1 : 2; // Type of reward
      rewardEntry[7] = rewardList[i].size; // Size of reward
      rewardEntry[8] = parseFloat(Math.random() * 150); // Value of reward
  
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
(async()=>{
    const form = [
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
            "speed": 150,
            "size": 50,
            "quantity": 3,
            "rewardValueList": [
                25,
                25,
                25
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
            "type": "BONUS",
            "speed": 80,
            "size": 60,
            "quantity": 1,
            "rewardValueList": [
                100
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
        }
    ]

    const data = await generateGameDataForRewards(form)
    console.log(calculateTotal(data[0],data[2]))
})()