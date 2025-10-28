
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Work Orders
        page.goto("http://localhost:5173/work-orders")
        page.wait_for_selector('.work-orders-table, .alert-danger')
        page.screenshot(path="jules-scratch/verification/work-orders.png")

        # Verify Locations
        page.goto("http://localhost:5173/locations")
        page.wait_for_selector('.location-list, .alert-danger')
        page.screenshot(path="jules-scratch/verification/locations.png")

        # Verify Tickets
        page.goto("http://localhost:5173/tickets")
        page.wait_for_selector('.tickets-table, .alert-danger')
        page.screenshot(path="jules-scratch/verification/tickets.png")

        browser.close()

run()
