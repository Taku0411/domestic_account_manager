from scraping import scraping 
from flask import Flask, render_template, jsonify

from pathlib import Path
import sqlite3

from logging import getLogger, DEBUG
import logging
logging.basicConfig(
    format="""%(asctime)s %(name)s:%(lineno)s %(funcName)s [%(levelname)s]: %(message)s""")
logger = getLogger(__name__)
logger.setLevel(DEBUG)

sqlite3_path = Path(__file__).parent.parent.parent / "data" / "data.sqlite3"


app = Flask(__name__)


@app.route("/")
@app.route("/index.html")
def index():
    return render_template("index.html")


@app.route("/cash_deposit.html")
def cash_deposit():
    return render_template("cash_deposit.html")


@app.route("/trust_invest.html")
def trust_invest():
    return render_template("trust_invest.html")


@app.route("/TotalPortfolio")
def get_portfolio():
    conn = sqlite3.connect(sqlite3_path)
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(date) from cash_deposit_data;")
    cursor.execute(
        "SELECT SUM(balance) FROM cash_deposit_data WHERE date = ?;", cursor.fetchall()[0])
    cash = cursor.fetchone()[0]

    cursor.execute("SELECT MAX(date) from trust_invest_data;")
    cursor.execute(
        "SELECT SUM(net_asset_value) from trust_invest_data WHERE date = ?", cursor.fetchall()[0])
    invest = cursor.fetchone()[0]
    res = [{"name": "現金資産", "y": cash}, {"name": "投資信託", "y": invest}]
    return jsonify(res)


@app.route("/TotalTimeSeries")
def get_total():
    result = {}
    result["value"] = {}

    # date
    conn = sqlite3.connect(sqlite3_path)
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT date FROM cash_deposit_data;")
    result["date"] = [item[0] for item in cursor.fetchall()]

    num = len(result["date"])
    result["value"]["total"] = [0 for i in range(num)]
    logger.info(result["value"]["total"])

    # cash_deposit
    cursor.execute("SELECT SUM(balance) FROM cash_deposit_data GROUP BY date;")
    result["value"]["cash_deposit"] = [item[0] for item in cursor.fetchall()]
    for i in range(num):
        result["value"]["total"][i] += result["value"]["cash_deposit"][i]

    # trust_invest
    cursor.execute(
        "SELECT SUM(net_asset_value) FROM trust_invest_data GROUP BY date;")
    result["value"]["trust_invest"] = [item[0] for item in cursor.fetchall()]
    for i in range(num):
        result["value"]["total"][i] += result["value"]["trust_invest"][i]
    logger.info(result)

    return jsonify(result)


@app.route("/cash_deposit")
def get_cash_deposit():
    result = {}
    conn = sqlite3.connect(sqlite3_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cash_deposit_account;")
    cash_deposit_list = cursor.fetchall()

    result["ndata"] = len(cash_deposit_list)
    result["date"] = []

    cursor.execute(
        "SELECT date, SUM(balance) FROM cash_deposit_data GROUP BY date;")
    for i in cursor.fetchall():
        result["date"].append(i[0])

    for account in cash_deposit_list:
        account_id = account[0]
        account_type = account[1]
        account_name = account[2]
        cursor.execute(
            "SELECT * FROM cash_deposit_data WHERE account_id = ? ORDER BY date;", (account_id,))
        result[f"{account_id}"] = {}
        result[f"{account_id}"]["account_type"] = account_type
        result[f"{account_id}"]["account_name"] = account_name
        result[f"{account_id}"]["data"] = []
        for i in cursor.fetchall():
            result[f"{account_id}"]["data"].append(i[2])
    logger.info(result)

    return jsonify(result)


@ app.route("/trust_invest")
def get_trust_invest():
    result = {}
    conn = sqlite3.connect(sqlite3_path)
    cursor = conn.cursor()

    # get number of data
    cursor.execute("SELECT * FROM trust_invest_account;")
    trust_invest_list = cursor.fetchall()
    result["ndata"] = len(trust_invest_list)

    result["total"] = {}
    result["total"]["invested_amount"] = []
    result["total"]["net_asset_value"] = []
    result["total"]["gain_loss"] = []
    result["total"]["gain_loss_percentage"] = []
    result["date"] = []
    cursor.execute("SELECT DISTINCT date FROM trust_invest_data;")
    for i in cursor.fetchall():
        result["date"].append(i[0])
        cursor.execute("SELECT * FROM trust_invest_data WHERE date = ?;", i)

        net_asset_value = 0
        gain_loss = 0
        for j in cursor.fetchall():
            net_asset_value += j[2]
            gain_loss += j[3]
        invested_amount = net_asset_value - gain_loss
        gain_loss_percentage = float(gain_loss) * 100 / invested_amount
        result["total"]["invested_amount"].append(invested_amount)
        result["total"]["net_asset_value"].append(net_asset_value)
        result["total"]["gain_loss"].append(gain_loss)
        result["total"]["gain_loss_percentage"].append(gain_loss_percentage)

    # 口座のループ
    for account in trust_invest_list:
        invest_id = account[0]
        invest_name = account[1]
        bank_name = account[2]
        cursor.execute(
            "SELECT * FROM trust_invest_data WHERE invest_id = ? ORDER BY date;", (invest_id,))
        result[f"{invest_id}"] = {}
        result[f"{invest_id}"]["invest_name"] = invest_name
        result[f"{invest_id}"]["bank_name"] = bank_name
        result[f"{invest_id}"]["data"] = {}
        result[f"{invest_id}"]["data"]["invested_amount"] = []
        result[f"{invest_id}"]["data"]["net_asset_value"] = []
        result[f"{invest_id}"]["data"]["gain_loss"] = []
        result[f"{invest_id}"]["data"]["gain_loss_percentage"] = []

        fetched = cursor.fetchall()
        for i in range(len(result["date"]) - len(fetched)):
            result[f"{invest_id}"]["data"]["invested_amount"].append(0)
            result[f"{invest_id}"]["data"]["net_asset_value"].append(0)
            result[f"{invest_id}"]["data"]["gain_loss"].append(0)
            result[f"{invest_id}"]["data"]["gain_loss_percentage"].append(0.0)

        for i in fetched:
            # 投資額を計算
            amount = i[2] - i[3]
            result[f"{invest_id}"]["data"]["invested_amount"].append(amount)
            result[f"{invest_id}"]["data"]["net_asset_value"].append(i[2])
            result[f"{invest_id}"]["data"]["gain_loss"].append(i[3])
            result[f"{invest_id}"]["data"]["gain_loss_percentage"].append(i[4])
    logger.info(result)

    return jsonify(result)


@app.route("/update", methods=["POST"])
def update():
    try:
        scraping.scraping()
        logger.info("update start")
        return jsonify(status="success")
    except Exception as e:
        return jsonify(status="failure", error=str(e))


if __name__ == "__main__":
    app.run(debug=True)
