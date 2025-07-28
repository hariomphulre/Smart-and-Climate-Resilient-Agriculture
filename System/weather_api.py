import requests

# Get public IP info
response = requests.get("https://ipinfo.io/json")

if response.status_code == 200:
    data = response.json()
    city = data.get("city")
    country_code = data.get("country")
    region=data.get("region")
    pin_code=data.get("postal")

API_KEY = "fde2fa13207350d532c8e55131f22bd3"
URL = f"https://api.openweathermap.org/data/2.5/weather?q={city},{country_code}&appid={API_KEY}&units=metric"

response = requests.get(URL)

if response.status_code == 200:
    data = response.json()
    print(f"Location: {data["name"]}, {region}, {country_code} ({pin_code})")
    print("Temperature:", data["main"]["temp"], "°C")
    print("Weather:", data["weather"][0]["description"])
    print("Humidity:", data["main"]["humidity"], "%")
    print("Wind Speed:", data["wind"]["speed"], "m/s")
else:
    print(response.status_code)
