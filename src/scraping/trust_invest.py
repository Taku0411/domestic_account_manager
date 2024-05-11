import sqlite3
import sys
from pathlib import Path
from datetime import datetime

from logging import getLogger, DEBUG
import logging
logging.basicConfig(
    format="""%(asctime)s %(name)s:%(lineno)s %(funcName)s [%(levelname)s]: %(message)s""")
logger = getLogger(__name__)
logger.setLevel(DEBUG)


class trust_invest():
    def __init__(self, sqlite_path: Path):
        if not sqlite_path.exists():
            logger.error(f"no such file or directory: {sqlite_path}")
            sys.exit(1)

        self.conn = sqlite3.connect(sqlite_path)
        self.invest_id_ = -1
        self.invest_name_ = "none"
        self.bank_name_ = "none"
        self.date_ = datetime.now()
        self.net_asset_value_ = 0
        self.gain_loss_ = 0
        self.gain_loss_percentage_ = 0.0

    def set(self, invest_name: str, bank_name: str, date: datetime, net_asset_value: int, gain_loss: int, gain_loss_percentage: float):
        self.invest_id_ = -1
        self.invest_name_ = invest_name
        self.bank_name_ = bank_name
        self.date_ = date
        self.net_asset_value_ = net_asset_value
        self.gain_loss_ = gain_loss
        self.gain_loss_percentage_ = gain_loss_percentage

    def determine_invest_id(self):
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT invest_id FROM trust_invest_account WHERE invest_name = ? AND bank_name = ?;", (self.invest_name_, self.bank_name_,))
        result = cursor.fetchall()
        if len(result) == 1:
            self.invest_id_ = result[0][0]
            logger.info(f"invest_id is {self.invest_id_}")
        elif len(result) == 0:
            cursor.execute(
                "SELECT COUNT(*) FROM trust_invest_account;")
            result_length = cursor.fetchone()
            self.invest_id_ = result_length[0]
            logger.info(f"invest_id is {self.invest_id_}")
            cursor.execute(
                f"INSERT INTO trust_invest_account (invest_id, invest_name, bank_name) values (?, ?, ?)", (
                    self.invest_id_, self.invest_name_, self.bank_name_)
            )
            self.conn.commit()
        else:
            logger.error("critical error occured!")
            sys.exit(1)

    def write(self):
        cursor = self.conn.cursor()
        cursor.execute(
            "INSERT INTO trust_invest_data (invest_id, date, net_asset_value, gain_loss, gain_loss_percentage) values (?, ?, ?, ?, ?)", (
                self.invest_id_, self.date_, self.net_asset_value_, self.gain_loss_, self.gain_loss_percentage_)
        )
        logger.info("write as")
        logger.info(
            f"INSERT INTO trust_invest_data ({self.invest_id_}, {self.date_}, {self.net_asset_value_})")
        self.conn.commit()


if __name__ == "__main__":
    logger.info("debug started")
    path = Path("./data.sqlite3")

    tmp = trust_invest(path)
    tmp.set("SMBC・DCインデックスファンド(日経225)(つみたてNISA)",
            "三井住友銀行", datetime.now(), 130162, 37176, 39.98)
    tmp.determine_invest_id()
    tmp.write()

    tmp = trust_invest(path)
    tmp.set("SMBC・DCインデックスファンド(S&P500)(つみたてNISA)",
            "三井住友銀行", datetime.now(), 223435, 70684, 46.27)
    tmp.determine_invest_id()
    tmp.write()
