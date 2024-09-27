import requests
import datetime

from smart_airdrop_claimer import base
from core.headers import headers
from core.info import get_info


def get_card(data, proxies=None):
    url = "https://api.hamsterkombatgame.io/interlude/upgrades-for-buy"

    try:
        response = requests.post(
            url=url,
            headers=headers(data=data),
            proxies=proxies,
            timeout=20,
        )
        data = response.json()
        card_list = data["upgradesForBuy"]
        return card_list
    except:
        return None


def buy_card(data, card_id, proxies=None):
    url = "https://api.hamsterkombatgame.io/interlude/buy-upgrade"
    current_time = datetime.datetime.now()
    current_timestamp = int(current_time.timestamp())
    payload = {"upgradeId": card_id, "timestamp": current_timestamp}

    try:
        response = requests.post(
            url=url,
            headers=headers(data=data),
            json=payload,
            proxies=proxies,
            timeout=20,
        )
        data = response.json()
        return data
    except:
        return None


def profit_price_ratio(item):
    return float(item["profitPerHourDelta"]) / float(item["price"])


def get_highest_ratio_item(data, proxies=None):
    highest_ratio_item = None
    highest_ratio = 0
    card_list = get_card(data=data, proxies=proxies)
    available_taps, balance_coins = get_info(data=data, proxies=proxies)
    if card_list:
        for item in card_list:
            is_expired = item["isExpired"]
            is_available = item["isAvailable"]
            price = item["price"]
            cooldown = item.get("cooldownSeconds", 0)
            max_level = item.get("maxLevel", 1)
            level = item.get("level", 0)
            if not is_expired and is_available:
                if price == 0:
                    if level < max_level:
                        highest_ratio_item = {
                            "id": item["id"],
                            "name": item["name"],
                            "price": item["price"],
                            "profit": float(item["profitPerHourDelta"]),
                        }
                        return highest_ratio_item
                else:
                    ratio = profit_price_ratio(item)
                    print(profit_price_ratio)
                    if (
                        ratio > highest_ratio
                        and price < balance_coins
                        # and cooldown == 0
                    ):
                        highest_ratio = ratio
                        highest_ratio_item = {
                            "id": item["id"],
                            "name": item["name"],
                            "price": item["price"],
                            "profit": float(item["profitPerHourDelta"]),
                        }
        return highest_ratio_item
    else:
        base.log(f"{base.white}Auto Buy Card: {base.red}Get card list fail")
        return None


def process_buy_card(data, proxies=None):
    while True:
        highest_ratio_item = get_highest_ratio_item(data=data, proxies=proxies)
        print(highest_ratio_item)
        if highest_ratio_item:
            card_id = highest_ratio_item["id"]
            card_name = highest_ratio_item["name"]
            card_price = highest_ratio_item["price"]
            card_profit = highest_ratio_item["profit"]
            base.log(
                f"{base.white}Auto Buy Card: {base.yellow}Highest profitable card {base.white}| {base.yellow}Card: {base.white}{card_name} - {base.yellow}Price: {base.white}{card_price:,} - {base.yellow}Profit Increase: {base.white}{int(card_profit):,}"
            )
            start_buy_card = buy_card(data=data, card_id=card_id, proxies=proxies)
            try:
                upgrades = start_buy_card["clickerUser"]["upgrades"]
                base.log(
                    f"{base.white}Auto Buy Card: {base.green}Buy card success {base.white}| {base.yellow}Card: {base.white}{card_name}"
                )
            except:
                error_message = start_buy_card["error_message"]
                base.log(f"{base.white}Auto Buy Card: {base.red}{error_message}")
                break
        else:
            base.log(
                f"{base.white}Auto Buy Card: {base.red}Not enough coin to buy card"
            )
            break
