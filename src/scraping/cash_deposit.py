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


class cash_deposit():
    def __init__(self, sqlite_path: Path):
        if not sqlite_path.exists():
            logger.error(f"no such file or directory: {sqlite_path}")
            sys.exit(1)

        self.conn = sqlite3.connect(sqlite_path)
        self.account_id_ = -1
        self.account_type_ = "none"
        self.bank_name_ = "none"
        self.date_ = datetime.now()
        self.value_ = 0

    def set(self, account_type: str, bank_name: str, date: datetime, value: int):
        self.account_id_ = -1
        self.account_type_ = account_type
        self.bank_name_ = bank_name
        self.date_ = date
        self.value_ = value

    def determine_account_id(self):
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT account_id FROM cash_deposit_account WHERE account_type = ? AND bank_name = ?;", (self.account_type_, self.bank_name_,))
        result = cursor.fetchall()
        if len(result) == 1:
            self.account_id_ = result[0][0]
            logger.info(f"account_id is {self.account_id_}")
        elif len(result) == 0:
            cursor.execute(
                "SELECT COUNT(*) FROM cash_deposit_account;")
            result_length = cursor.fetchone()
            self.account_id_ = result_length[0]
            logger.info(f"account_id is {self.account_id_}")
            cursor.execute(
                f"INSERT INTO cash_deposit_account (account_id, account_type, bank_name) values (?, ?, ?)", (
                    self.account_id_, self.account_type_, self.bank_name_)
            )
            self.conn.commit()
        else:
            logger.error("critical error occured!")
            sys.exit(1)

    def write(self):
        cursor = self.conn.cursor()
        cursor.execute(
            "INSERT INTO cash_deposit_data (account_id, date, balance) values (?, ?, ?)", (
                self.account_id_, self.date_, self.value_)
        )
        logger.info("write as")
        logger.info(
            f"INSERT INTO cash_deposit_data ({self.account_id_}, {self.date_}, {self.value_})")
        self.conn.commit()


if __name__ == "__main__":
    logger.info("debug started")
    path = Path("./data.sqlite3")

    tmp = cash_deposit(path)
    tmp.set("円普通預金", "ソニー銀行", datetime.now(), 160)
    tmp.determine_account_id()
    tmp.write()

    tmp = cash_deposit(path)
    tmp.set("残高別普通預金残高", "三井住友銀行", datetime.now(), 40934)
    tmp.determine_account_id()
    tmp.write()

    tmp = cash_deposit(path)
    tmp.set("普通預金残高", "三井住友銀行", datetime.now(), 60354)
    tmp.determine_account_id()
    tmp.write()

    tmp = cash_deposit(path)
    tmp.set("普通", "三菱UFJ銀行", datetime.now(), 962)
    tmp.determine_account_id()
    tmp.write()
