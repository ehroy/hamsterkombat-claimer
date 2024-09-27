import sys
import requests
import threading  # Import threading
sys.dont_write_bytecode = True
import datetime
from smart_airdrop_claimer import base
from core.info import get_info
from core.tapper import process_tap
from core.upgrade import process_buy_card

import time
import random


class HamsterKombat:
    def __init__(self):
        # Get file directory
        self.data_file = base.file_path(file_name="data.txt")
        self.config_file = base.file_path(file_name="config.json")

        # Initialize line
        self.line = base.create_line(length=50)

        # Initialize banner
        self.banner = base.create_banner(game_name="Hamster Kombat")

        # Get config
        self.auto_tap = base.get_config(
            config_file=self.config_file, config_name="auto-tap"
        )

        self.auto_buy_card = base.get_config(
            config_file=self.config_file, config_name="auto-buy-card"
        )

    def process_account(self, data, no, num_acc):
        try:
            base.log(self.line)
            base.log(f"{base.green}Account number: {base.white}{no + 1}/{num_acc}")
            datas = {"initDataRaw": data}

            res = requests.post("https://api.hamsterkombat.io/auth/auth-by-telegram-webapp", json=datas).json()
            get_info(data=res['authToken'])
            headers = {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'authorization': f"Bearer {res['authToken']}",
                'origin': 'https://hamsterkombatgame.io',
                'priority': 'u=1, i',
                'referer': 'https://hamsterkombatgame.io/',
                'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            }
            listtask = requests.post("https://api.hamsterkombatgame.io/interlude/upgrades-for-buy", headers=headers).json()
            # print(listtask)
            for task in listtask['upgradesForBuy']:
                current_time = datetime.datetime.now()
                current_timestamp = int(current_time.timestamp())
                datad = {"upgradeId":task['id'],"timestamp":current_timestamp}
                taskcheck = requests.post("https://api.hamsterkombatgame.io/interlude/buy-upgrade", headers=headers, json=datad).json()
                print(taskcheck['interludeUser']['earnPassivePerHour'])
        except Exception as e:
            base.log(f"{base.red}Error: {base.white}{e}")

    def main(self):
    
        base.clear_terminal()
        print(self.banner)
        data = open(self.data_file, "r").read().splitlines()
        num_acc = len(data)
        base.log(self.line)
        base.log(f"{base.green}Number of accounts: {base.white}{num_acc}")

        threads = []

        # Create and start a thread for each account
        for no, account_data in enumerate(data):
            thread = threading.Thread(target=self.process_account, args=(account_data, no, num_acc))
            threads.append(thread)
            thread.start()

        # Wait for all threads to finish
        for thread in threads:
            thread.join()

        print()
        wait_time = random.randint(5, 20)
        base.log(f"{base.yellow}Wait for {wait_time} seconds!")
        time.sleep(wait_time)


if __name__ == "__main__":
    try:
        hamster = HamsterKombat()
        hamster.main()
    except KeyboardInterrupt:
        sys.exit()
