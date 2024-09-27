import requests
import json
import time
from colorama import Fore, Style
import os
# from datetime import datetime, timedelta, timezone

class Binance:
    def __init__(self):
        self.headers = {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
            "Content-Type": "application/json",
            "Origin": "https://www.binance.com",
            "Referer": "https://www.binance.com/vi/game/tg/moon-bix",
            "Sec-Ch-Ua": '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self.game_response = None
        self.game = None
    def print_welcome_message(self):
            print(r"""
        ▄▄▄▄▀ █    ▄█  ▄▄ █    ▄   ▄█ ██▄   ▄█    ▄▄▄▄▀ ▀▄    ▄ 
        ▀▀▀ █    █    ██ █   █     █  ██ █  █  ██ ▀▀▀ █      █  █  
            █    █    ██  ▀▀▀█  █   █ ██ █   █ ██     █       ▀█   
        █     ███▄ ▐█     █  █   █ ▐█ █  █  ▐█    █        █    
        ▀          ▀ ▐      █ █▄ ▄█  ▐ ███▀   ▐   ▀       ▄▀     
                            ▀ ▀▀▀                           
            """)
            print(Fore.GREEN + Style.BRIGHT + "moonbix BOT recode")
            # current_time = datetime.now()
            # up_time = current_time - start_time
            # days, remainder = divmod(up_time.total_seconds(), 86400)
            # hours, remainder = divmod(remainder, 3600)
            # minutes, seconds = divmod(remainder, 60)
            # print(Fore.CYAN + Style.BRIGHT + f"Up time bot: {int(days)} hari, {int(hours)} jam, {int(minutes)} menit, {int(seconds)} detik\n\n")

    def log(self, msg, msg_type='info'):
        timestamp = time.strftime('%H:%M:%S')
        if msg_type == 'success':
            print(Fore.GREEN + f"[{timestamp}] [*] {msg}" + Style.RESET_ALL)
        elif msg_type == 'custom':
            print(Fore.MAGENTA + f"[{timestamp}] [*] {msg}" + Style.RESET_ALL)
        elif msg_type == 'error':
            print(Fore.RED + f"[{timestamp}] [!] {msg}" + Style.RESET_ALL)
        elif msg_type == 'warning':
            print(Fore.YELLOW + f"[{timestamp}] [*] {msg}" + Style.RESET_ALL)
        else:
            print(f"[{timestamp}] [*] {msg}")

    def countdown(self, minutes):
        seconds = minutes * 60
        for i in range(seconds, 0, -1):
            timestamp = time.strftime('%H:%M:%S')
            print(f"[{timestamp}] [*] Waiting {i // 60}m {i % 60}s to continue...", end="\r")
            time.sleep(1)
        print(" " * 80, end="\r")

    def call_binance_api(self, query_string):
        access_token_url = "https://www.binance.com/bapi/growth/v1/friendly/growth-paas/third-party/access/accessToken"
        user_info_url = "https://www.binance.com/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/user/user-info"
        
        try:
            access_token_response = self.session.post(access_token_url, json={"queryString": query_string, "socialType": "telegram"})
            access_token_data = access_token_response.json()

            if access_token_data['code'] != "000000" or not access_token_data['success']:
                raise Exception(f"Failed to get access token: {access_token_data['message']}")
            
            access_token = access_token_data['data']['accessToken']
            self.session.headers.update({"X-Growth-Token": access_token})
            user_info_response = self.session.post(user_info_url, json={"resourceId": 2056})

            user_info_data = user_info_response.json()

            if user_info_data['code'] != "000000" or not user_info_data['success']:
                raise Exception(f"Failed to get user info: {user_info_data['message']}")

            available_tickets = user_info_data['data']['metaInfo'].get('totalAttempts', 0)
            total_grade = user_info_data['data']['metaInfo'].get('totalGrade', 0)

            return {"userInfo": user_info_data['data'], "accessToken": access_token, "availableTickets": available_tickets, "totalGrade": total_grade}

        except Exception as error:
            self.log(f"API call failed: {error}", 'error')
            return None

    def start_game(self, access_token):
        try:
            response = self.session.post(
                'https://www.binance.com/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/game/start',
                json={"resourceId": 2056},
                headers={"X-Growth-Token": access_token}
            )
            data = response.json()

            if data['code'] == '000000':
                self.log("Game started successfully", 'success')
                self.game_response = data
                return True
            else:
                self.log("Error starting the game!", 'error')
                return False
        except Exception as e:
            self.log(f"Start game error: {e}", 'error')
            return False

    def game_data(self):
        try:
            response = requests.post('https://vemid42929.pythonanywhere.com/api/v1/moonbix/play', json=self.game_response)
            data = response.json()
            if data['message'] == 'success':
                self.game = data['game']
                self.log("Game data retrieved successfully", 'success')
                return True
            else:
                self.log(data['message'], 'warning')
                return False
        except Exception as e:
            self.log(f"Game data error: {e}", 'error')
            return False

    def complete_game(self, access_token):
        try:
            response = self.session.post(
                'https://www.binance.com/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/game/complete',
                json={"resourceId": 2056, "payload": self.game.get('payload'), "log": self.game.get('log')},
                headers={"X-Growth-Token": access_token}
            )
            data = response.json()

            if data['code'] == '000000' and data['success']:
                self.log(f"Game completed! Earned {self.game['log']} points", 'custom')
                return True
            else:
                self.log(f"Game completion error: {data['message']}", 'error')
                return False
        except Exception as e:
            self.log(f"Complete game error: {e}", 'error')
            return False

    def get_task_list(self, access_token):
        task_list_url = "https://www.binance.com/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/task/list"
        try:
            response = self.session.post(task_list_url, json={"resourceId": 2056}, headers={"X-Growth-Token": access_token})
            data = response.json()

            if data['code'] != "000000" or not data['success']:
                raise Exception(f"Cannot retrieve task list: {data.get('message', 'Unknown error')}")

            task_list = data['data'][0]['taskList']['data']
            resource_ids = [task['resourceId'] for task in task_list if task['completedCount'] == 0]

            if not resource_ids:
                self.log("No tasks available for completion", 'info')
            return resource_ids
        except Exception as error:
            self.log(f"Cannot retrieve task list: {error}", 'error')
            return []

    def complete_task(self, access_token, resource_id):
        complete_task_url = "https://www.binance.com/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/task/complete"
        try:
            response = self.session.post(complete_task_url, json={"resourceIdList": [resource_id]}, headers={"X-Growth-Token": access_token})
            data = response.json()

            if data['code'] != "000000" or not data['success']:
                raise Exception(f"Cannot complete the task: {data['message']}")

            self.log(f"Task {resource_id} completed successfully!", 'success')
            return True
        except Exception as error:
            self.log(f"Cannot complete the task: {error}", 'error')
            return False
    

    def main(self):
           # Store the start time when the script is initiated
        # start_time = datetime.now()

        # Print the welcome message
        while True :
            self.print_welcome_message()
        
            data_file = os.path.join(os.getcwd(), 'mon.txt')
            with open(data_file, 'r') as file:
                data = [line.strip() for line in file.readlines() if line.strip()]

            for query_string in data:
                user_data = json.loads(requests.utils.unquote(query_string.split('user=')[1].split('&')[0]))
                first_name = user_data.get('first_name', 'Unknown')
                self.log(f"Starting game for {first_name}", 'info')

                result = self.call_binance_api(query_string)
                if result:
                    access_token = result['accessToken']
                    available_tickets = result['availableTickets']
                    total_grade = result['totalGrade']

                    self.log(f"Total points: {total_grade}")
                    self.log(f"Available tickets: {available_tickets}")

                    if available_tickets > 0:
                        while available_tickets > 0:
                            self.log(f"Starting game with {available_tickets} tickets left", 'info')
                            if self.start_game(access_token):
                                if self.game_data():
                                    self.complete_game(access_token)
                                    available_tickets -= 1
                                else:
                                    break
                            else:
                                self.log(f"Failed to start game for {first_name}", 'error')
                                break
                    else:
                        self.log("No tickets available", 'warning')

                    # Get and complete tasks after the game
                    task_ids = self.get_task_list(access_token)
                    for task_id in task_ids:
                        self.complete_task(access_token, task_id)

            # Countdown for 11 minutes before the next cycle
            self.countdown(11)

# Instantiate and run
client = Binance()
client.main()
