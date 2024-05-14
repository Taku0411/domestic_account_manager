from flask import Flask, render_template, jsonify

from pathlib import Path
import sqlite3
import datetime

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
    result = {}
    result["labels"] = ["預金", "投資信託"]
    result["value"] = []
    conn = sqlite3.connect(sqlite3_path)
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(date) from cash_deposit_data;")
    cursor.execute(
        "SELECT SUM(balance) FROM cash_deposit_data WHERE date = ?;", cursor.fetchall()[0])
    result["value"].append(cursor.fetchone()[0])

    cursor.execute("SELECT MAX(date) from trust_invest_data;")
    cursor.execute(
        "SELECT SUM(net_asset_value) from trust_invest_data WHERE date = ?", cursor.fetchall()[0])
    result["value"].append(cursor.fetchone())

    return jsonify(result)


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
    print(result["value"]["total"])

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
    print(result)

    return jsonify(result)


@app.route("/cash_deposit")
def get_cash_deposit():
    result = {}
    conn = sqlite3.connect(sqlite3_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cash_deposit_account;")
    cash_deposit_list = cursor.fetchall()

    result["ndata"] = len(cash_deposit_list)
    result["total"] = []

    cursor.execute(
        "SELECT date, SUM(balance) FROM cash_deposit_data GROUP BY date;")
    for i in cursor.fetchall():
        result["total"].append([i[0], i[1]])

    for account in cash_deposit_list:
        print(account)
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
            result[f"{account_id}"]["data"].append([[i[1], i[2]]])

    return jsonify(result)


@app.route("/trust_invest")
def get_trust_invest():
    result = {}
    conn = sqlite3.connect(sqlite3_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trust_invest_account;")
    trust_invest_list = cursor.fetchall()

    result["ndata"] = len(trust_invest_list)
    result["total"] = []

    cursor.execute("SELECT DISTINCT date FROM trust_invest_data;")
    for i in cursor.fetchall():
        print(i)
        cursor.execute("SELECT * FROM trust_invest_data WHERE date = ?;", i)

        net_asset_value = 0
        gain_loss = 0
        for j in cursor.fetchall():
            net_asset_value += j[2]
            gain_loss += j[3]
        gain_loss_percentage = float(
            net_asset_value + gain_loss) * 100 / gain_loss
        result["total"].append(
            [i[0], net_asset_value, gain_loss, gain_loss_percentage])

    for account in trust_invest_list:
        print(account)
        invest_id = account[0]
        invest_name = account[1]
        bank_name = account[2]
        cursor.execute(
            "SELECT * FROM trust_invest_data WHERE invest_id = ? ORDER BY date;", (invest_id,))
        result[f"{invest_id}"] = {}
        result[f"{invest_id}"]["invest_name"] = invest_name
        result[f"{invest_id}"]["bank_name"] = bank_name
        result[f"{invest_id}"]["data"] = []
        for i in cursor.fetchall():
            result[f"{invest_id}"]["data"].append([[i[1], i[2], i[3], i[4]]])

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
