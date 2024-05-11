import time
import tomllib
from datetime import datetime
import trust_invest
import cash_deposit
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
    # options.add_argument("--headless")
    options.add_experimental_option("detach", True)

    driver = webdriver.Chrome(options=options)

    with open("data.toml", "rb") as f:
        data = tomllib.load(f)

    # login
    login_actions_str = data["login_actions"]
    login_actions = selenium_basics.actions(driver=driver)
    for item in login_actions_str:
        login_actions.do(item)

    # update accounts
    table = driver.find_element(
        by=By.XPATH, value="""//*[@id="account-table"]""")
    # account_element_list = table.find_elements(by=By.TAG_NAME, value="tr")[1:]
    # for account in account_element_list:
    # account.find_element(by=By.NAME, value="commit").click()
    # time.sleep(60)

    # extract cash_deposit
    driver.find_element(
        by=By.XPATH, value="""//*[@id="header-container"]/header/div[2]/ul/li[4]/a""").click()

    cash_deposit_table = driver.find_element(
        by=By.XPATH, value="""//*[@id="portfolio_det_depo"]/section/table/tbody""")
    cash_deposit_list = cash_deposit_table.find_elements(
        by=By.TAG_NAME, value="tr")
    for account in cash_deposit_list:
        logger.info(account.text)
        column = account.find_elements(by=By.TAG_NAME, value="td")
        account_type = column[0].text
        balance = int(column[1].text.replace(",", "").replace("円", ""))
        bank_name = column[2].text

        sql = cash_deposit.cash_deposit(sqlite3_path)
        sql.set(account_type, bank_name, datetime.now(), balance)
        sql.determine_account_id()
        sql.write()

    # extract trust investment
    trust_invest_table = driver.find_element(
        by=By.XPATH, value="""/html/body/div[1]/div[3]/div/div/div[2]/section[2]/table""")
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
        sql.set(invest_name, bank_name, datetime.now(),
                net_asset_value, gain_loss, gain_loss_percentage)
        sql.determine_invest_id()
        sql.write()


if __name__ == "__main__":
    main()
