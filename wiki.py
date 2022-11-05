import wikipedia as wp
import requests

language = "es"

wp.set_lang(language)

def search_places(lat, lon, limit = 100):
    #COORDS = "37.1809411|-3.6262913"
    COORDS = f"{lat}|{lon}"

    S = requests.Session()

    URL = f"https://{language}.wikipedia.org/w/api.php"

    PARAMS = {
        "format": "json",
        "list": "geosearch",
        "gscoord": COORDS,
        "gslimit": str(limit),
        "gsradius": "10000",
        "action": "query"
    }

    R = S.get(url=URL, params=PARAMS)
    DATA = R.json()

    PLACES = DATA['query']['geosearch']

    ret = []

    for place in PLACES:
        print(place)
        obj = {
            "lat": place['lat'],
            "lon": place['lon'],
            "title": place['title'],
            "pageid": place['pageid'],
            "dist": place['dist'],
            "primary": place["primary"]
        }
        print(obj)
        ret.append(obj)

    return ret


def get_page_info(title):
    wikipage = wp.page(title)
    
    return {
        "title": wikipage.title,
        "summary": wikipage.summary,
        "content": wikipage.content,
        "images": wikipage.images
    }