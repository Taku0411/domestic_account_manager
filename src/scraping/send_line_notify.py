# https://qiita.com/PRESENT_Science/items/49e89837d8f028965a19
import requests
import os

token = os.environ["ENV_LINE"]
uid = os.environ["ENV_UID"]

def send_line(msg: str):
    url = "https://api.line.me/v2/bot/message/broadcast"
    headers = {
            "Content_Type": "application/json",
            "Authorization": "Bearer " + token
            }
    payload = {
            "to": uid,
            "messages": [{
                "type": "text",
                "text": msg,
                }]
            }
    res = requests.post(url, headers=headers, json=payload).json()
    print(res)

if __name__ == "__main__":
    send_line("hello world")
