import sys
import requests
import threading  # Import threading
sys.dont_write_bytecode = True

from core.info import get_info
from core.tapper import process_tap
from core.upgrade import process_buy_card

import time
import random
data = open('vana.txt', "r").read().splitlines()
for element in data:
        try:
            headers = {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/json',
                'origin': 'https://www.vanadatahero.com',
                'priority': 'u=1, i',
                'referer': 'https://www.vanadatahero.com/challenges',
                'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'x-telegram-web-app-init-data': element,
            }
            account = requests.get('https://www.vanadatahero.com/api/player', headers=headers)
            print(account.text)
            
            response = requests.get('https://www.vanadatahero.com/api/tasks', headers=headers).json()
            for task in response['tasks']:
                json_data = {
                    'status': 'completed',
                    'points': int(task['points']),
                }
                print(json_data)
                
                claimtask = requests.post(f'https://www.vanadatahero.com/api/tasks/{task['id']}', headers=headers, json=json_data).json()

                print(claimtask)
        except Exception as e:
            print(e)