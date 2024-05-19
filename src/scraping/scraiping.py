import sys
import time
import tomllib
from datetime import datetime
import shutil

import selenium.common.exceptions

import trust_invest
import cash_deposit
import send_line_notify

from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
import selenium_basics
from pathlib import Path
from logging import getLogger, DEBUG
import logging
logging.basicConfig(
    format="""%(asctime)s %(name)s:%(lineno)s %(funcName)s [%(levelname)s]: %(message)s""")
logger = getLogger(__name__)
logger.setLevel(DEBUG)


sqlite3_path = Path(__file__).parent.parent.parent / "data" / "data.sqlite3"


def main():
    logger.info("scraping started")

    options = Options()
    options.add_argument("--headless")
    options.add_argument(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
    options.add_experimental_option("detach", True)

    service = webdriver.ChromeService()
    if len(sys.argv) != 1 and sys.argv[1] == "--production":
        service = webdriver.ChromeService(executable_path="/usr/bin/chromedriver")
    
    driver = webdriver.Chrome(options=options, service=service)

    with open("data.toml", "rb") as f:
        data = tomllib.load(f)

    # login
    logger.info("login startted")
    login_actions_str = data["login_actions"]
    login_actions = selenium_basics.actions(driver=driver)
    for item in login_actions_str:
        login_actions.do(item)
        logger.info(f"{item}")
    logger.info("login actions done")

    # try no thank you for passkey
    try:
        driver.find_element(
            by=By.XPATH, value="""/html/body/main/div/div/div[2]/div/s/ection/div/a""").click()
    except selenium.common.exceptions.NoSuchElementException:
        logger.info("skipped no thank you pass key")
        pass
    time.sleep(1)
    driver.find_element(
        by=By.XPATH, value="""//*[@id="header-container"]/header/div[2]/ul/li[5]/a""").click()

    # update accounts
    logger.info("update account info started")
    table = driver.find_element(
        by=By.XPATH, value="""//*[@id="account-table"]""")
    account_element_list = table.find_elements(by=By.TAG_NAME, value="tr")[1:]
    for account in account_element_list:
        account.find_element(by=By.NAME, value="commit").click()

    # wait for updating
    sleep_sec = 120
    logger.info(f"sleeping for {sleep_sec}sec")
    time.sleep(sleep_sec)

    # check if update successfull
    account_element_list = driver.find_element(
        by=By.XPATH,  value="""//*[@id="account-table"]""").find_elements(by=By.TAG_NAME, value="tr")[1:]

    error_counter = 0
    for account in account_element_list:
        try:
            status = account.find_elements(
                by=By.TAG_NAME, value="td")[3]
            if status.text != "正常":
                logger.info("plused")
                error_counter += 1
        except selenium.common.exceptions.NoSuchElementException:
            logger.info("element not found")
            error_counter += 1

    # notify line
    now = datetime.now()
    msg = f"更新完了\n({now})"
    if error_counter != 0:
        msg = f"更新失敗！エラーがあります．詳しくは\nhttps://moneyforward.com/accounts\n({now})"
    send_line_notify.send_line(msg)
    if error_counter != 0:
        sys.exit(0)

    # extract cash_deposit
    logger.info("extract account info started")
    driver.find_element(
        by=By.XPATH, value="""//*[@id="header-container"]/header/div[2]/ul/li[4]/a""").click()

    cash_deposit_table = driver.find_element(
        by=By.XPATH, value="""//*[@id="portfolio_det_depo"]/section/table/tbody""")
    cash_deposit_list = cash_deposit_table.find_elements(
        by=By.TAG_NAME, value="tr")

    datetime_now = datetime.now()
    for account in cash_deposit_list:
        logger.info(account.text)
        column = account.find_elements(by=By.TAG_NAME, value="td")
        account_type = column[0].text
        balance = int(column[1].text.replace(",", "").replace("円", ""))
        bank_name = column[2].text

        sql = cash_deposit.cash_deposit(sqlite3_path)
        sql.set(account_type, bank_name, datetime_now, balance)
        sql.determine_account_id()
        sql.write()

    # extract trust investment
    logger.info("extract trust investment started")
    trust_invest_table = driver.find_element(
        by=By.XPATH, value="""//*[@id="portfolio_det_mf"]/table/tbody""")
    trust_invest_list = trust_invest_table.find_elements(
        by=By.TAG_NAME, value="tr")
    for account in trust_invest_list:
        logger.info(account.text)
        column = account.find_elements(by=By.TAG_NAME, value="td")
        invest_name = column[0].text
        net_asset_value = int(column[4].text.replace(",", "").replace("円", ""))
        gain_loss = int(column[6].text.replace(",", "").replace("円", ""))
        gain_loss_percentage = float(column[7].text.replace("%", ""))
        bank_name = column[8].text

        sql = trust_invest.trust_invest(sqlite3_path)
        sql.set(invest_name, bank_name, datetime_now,
                net_asset_value, gain_loss, gain_loss_percentage)
        sql.determine_invest_id()
        sql.write()

    # for back up, copy file
    target = sqlite3_path.parent / \
        str(datetime.now().strftime("%Y%m%d") + ".sqlite3")
    shutil.copy(sqlite3_path, target)


if __name__ == "__main__":
    main()
