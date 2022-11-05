import uvicorn
import wiki
from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]

app = FastAPI(middleware=middleware)


@app.get("/")
def read_root():
    return {"message": "Server is up and running!"}


@app.get("/search")
def wiki_search(lat, lon, limit: int = 10):
    print(lat)
    print(lon)
    ret = wiki.search_places(lat, lon, limit)
    return {"result": ret}


@app.get("/page_info")
def wiki_search(title: str):
    ret = wiki.get_page_info(title)
    return {"result": ret}


if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info", reload=True)