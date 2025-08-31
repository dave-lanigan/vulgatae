#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json

def scrape_latin_mass_readings():
    url = "https://latinmasshelper.com/readings/"
    
    # Add headers to mimic a real browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Example: Extract all readings (you'll need to adjust selectors)
        readings = []
        
        # Find reading containers (adjust selector based on actual HTML structure)
        reading_elements = soup.find_all('div', class_='reading')  # Example selector
        
        for element in reading_elements:
            reading = {
                'title': element.find('h3').text.strip() if element.find('h3') else '',
                'content': element.find('p').text.strip() if element.find('p') else '',
            }
            readings.append(reading)
        
        return readings
        
    except requests.RequestException as e:
        print(f"Error fetching the page: {e}")
        return []

if __name__ == "__main__":
    readings = scrape_latin_mass_readings()
    
    # Save to JSON
    with open('readings.json', 'w', encoding='utf-8') as f:
        json.dump(readings, f, indent=2, ensure_ascii=False)
    
    print(f"Scraped {len(readings)} readings")
