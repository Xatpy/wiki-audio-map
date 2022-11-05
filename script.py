import requests

# https://en.wikipedia.org/?curid=70083393

S = requests.Session()

URL = "https://en.wikipedia.org/w/api.php"

PARAMS = {
    "format": "json",
    "list": "geosearch",
    "gscoord": "37.1809411|-3.6262913",
    "gslimit": "100",
    "gsradius": "10000",
    "action": "query"
}

R = S.get(url=URL, params=PARAMS)
DATA = R.json()

PLACES = DATA['query']['geosearch']

for place in PLACES:
    #print(place)
    print(place['title'])