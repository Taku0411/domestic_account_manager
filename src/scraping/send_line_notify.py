# https://qiita.com/PRESENT_Science/items/49e89837d8f028965a19
import requests
import os

token = os.environ["ENV_LINE"]

def send_line(msg: str):
    url = "https://notify-api.line.me/api/notify"
    headers = {"Authorization": "Bearer " + token}
    payload = {"message": msg}
    requests.post(url, headers=headers, params=payload)

if __name__ == "__main__":
    send_line("hello world")
