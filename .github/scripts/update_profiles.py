import os
import json
import requests
from bs4 import BeautifulSoup

def check_url(url):
    try:
        print(f"Checking URL: {url}")
        response = requests.head(url)
        if response.status_code == 200:
            print(f"URL is valid: {url}")
            return True
        else:
            print(f"URL returned status code {response.status_code}: {url}")
            return False
    except requests.RequestException as e:
        print(f"Failed to check URL: {url}, error: {e}")
        return False

def get_new_image_url(profile_url):
    try:
        print(f"Fetching profile page: {profile_url}")
        response = requests.get(profile_url)
        if response.status_code != 200:
            print(f"Profile page returned status code {response.status_code}: {profile_url}")
            return None

        soup = BeautifulSoup(response.content, 'html.parser')
        icon_div = soup.find('div', class_='contentHeaderIcon')
        if not icon_div:
            print(f"Could not find 'contentHeaderIcon' div in profile page: {profile_url}")
            return None

        img_tag = icon_div.find('img')
        if not img_tag or 'src' not in img_tag.attrs:
            print(f"Could not find image tag or 'src' attribute in profile page: {profile_url}")
            return None

        new_image_url = img_tag['src']
        print(f"Extracted new image URL: {new_image_url}")
        return new_image_url
    except requests.RequestException as e:
        print(f"Failed to fetch profile page: {profile_url}, error: {e}")
        return None

def update_json_files():
    data_dir = 'Data'
    for filename in os.listdir(data_dir):
        if filename.endswith('.json'):
            filepath = os.path.join(data_dir, filename)
            print(f"Processing file: {filepath}")
            with open(filepath, 'r') as file:
                data = json.load(file)

            updated = False
            for member in data.get('members', []):
                picture_url = member.get('picture')
                profile_url = member.get('profile')

                if picture_url:
                    print(f"Checking member: {member.get('name')}, picture URL: {picture_url}")
                    if not check_url(picture_url):
                        print(f"Picture URL is invalid, attempting to fetch new URL from profile: {profile_url}")
                        new_picture_url = get_new_image_url(profile_url)
                        if new_picture_url:
                            print(f"Updating picture URL for member: {member.get('name')}")
                            member['picture'] = new_picture_url
                            updated = True

            if updated:
                print(f"Updating JSON file with new picture URLs: {filepath}")
                with open(filepath, 'w', encoding='utf-8') as file:
                    json.dump(data, file, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    update_json_files()
