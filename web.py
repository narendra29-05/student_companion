from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

def get_attendance(roll_no, password):
    # Initialize the browser (Chrome)
    driver = webdriver.Chrome() 
    driver.get("YOUR_COLLEGE_PORTAL_LINK_HERE")

    try:
        # 1. Locate the login fields (you'll need to find the 'id' or 'name' from the site)
        user_input = driver.find_element(By.NAME, "username_field_name")
        pass_input = driver.find_element(By.NAME, "password_field_name")

        # 2. Enter credentials and log in
        user_input.send_keys(roll_no)
        pass_input.send_keys(password)
        pass_input.send_keys(Keys.ENTER)

        time.sleep(5) # Wait for page to load

        # 3. Scrape the attendance values
        # Example: looking for a table cell with a specific class
        attended = driver.find_element(By.ID, "attended_count_id").text
        total = driver.find_element(By.ID, "total_classes_id").text

        return int(attended), int(total)

    finally:
        driver.quit()
print(get_attendance("22mh1a42a5", "aditya"))
