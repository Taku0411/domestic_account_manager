from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

import pyotp

import os

from logging import getLogger
logger = getLogger(__name__)


class actions:
    def __init__(self, driver):
        self.driver = driver

    def do(self, instructions: list):
        if (instructions[0] == "go_url"):
            self.get_url(instructions[1])
        elif (instructions[0] == "click"):
            self.click(instructions[1])
        elif (instructions[0] == "fill"):
            self.fill(instructions[1], os.environ[instructions[2]])
        elif (instructions[0] == "fill_otp"):
            totp = pyotp.TOTP(os.environ[instructions[2]])
            code = totp.now()
            self.fill(instructions[1], code)
            logger.debug(f"otp code: {code}")
        else:
            logger.error("parse failed in {}".format(instructions[0]))

    def get_url(self, url: str):
        self.driver.get(url)
        logger.debug("sussessfully got {}".format(url))

    def click(self, xpath: str):
        elem = self.driver.find_element(by=By.XPATH, value=xpath)
        elem.click()
        logger.debug("sussessfully clicked {}".format(xpath))

    def fill(self, xpath: str, string: str):
        elem = self.driver.find_element(by=By.XPATH, value=xpath)
        elem.send_keys(string)
        logger.debug("sussessfully filled {}".format(xpath))
