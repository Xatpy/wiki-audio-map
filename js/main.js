const checkIfIsMobile = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
const isMobile = checkIfIsMobile();

var Esri_WorldStreetMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  }
);

const CACHE_PLACES = {};

var markersLayer = new L.LayerGroup();
var msg = new SpeechSynthesisUtterance();
// msg.voice = speechSynthesis.getVoices().find((a) => a.lang === "es-ES");
msg.lang = "es-ES";
msg.rate = 0.85;

map = L.map("map", {
  center: [40.3093, -3.6842],
  //   zoom: isMobile ? 12 : 13, // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
  zoom: 7,
  minZoom: 3,
  scrollWheelZoom: true,
  tap: false,
});
Esri_WorldStreetMap.addTo(map);
markersLayer.addTo(map);

const centerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [28, 44],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
let mainCenterMaker = L.marker(map.getCenter(), {
  icon: centerIcon,
});
markersLayer.addLayer(mainCenterMaker);

map.on("move", function () {
  updateMapCenter();
});

map.on("movestart", function () {
  initMapCenter();
});

map.on("moveend", function () {
  const center = map.getCenter();
  const lat = center.lat;
  const long = center.lng;
  searchLocation(lat, long);

  markersLayer.clearLayers();
  initMapCenter();
  updateMapCenter();
});

const initMapCenter = () => {
  const center = map.getCenter();
  mainCenterMaker = L.marker(center, {
    icon: centerIcon,
  });
  markersLayer.addLayer(mainCenterMaker);

  const radius = 10000;
  markersLayer.addLayer(L.circle(center, radius).addTo(map));
};

const updateMapCenter = () => {
  mainCenterMaker.setLatLng(map.getCenter());
};

const exampleData = {
  result: [
    {
      lat: 37.26666666666666,
      lon: -3.6,
      title: "text_1",
    },
    {
      lat: 37.15,
      lon: -3.65,
      title: "text_2",
    },
  ],
};

const speak = (message) => {
  window.speechSynthesis.cancel();
  msg.text = message;
  window.speechSynthesis.speak(msg);
};

updateResponse = (data) => {
  markerOnClick = (e) => {
    speak(e.target.options.title);
  };

  for (d of data.result) {
    console.log(`Tit ${d.title}`);

    var marker = L.marker([d.lat, d.lon], {
      title: d.title,
      pageid: d.pageid,
    })
      .bindPopup(
        (obj) => {
          const title = obj.options.title;
          const pageid = obj.options.pageid;

          let el = document.createElement("div");
          el.style.width = "300px";
          el.style.textAlign = "center";
          el.style.maxWidth = "300px";
          el.style.maxHeight = "250px";
          el.style.overflow = "scroll";

          let html = `<h4>${title}</h4>`;
          el.innerHTML = html;

          const getData = async (url) => {
            // TODO implement cache
            const response = await fetch(url);
            if (response.ok) {
              const json = await response.json();
              //   html += `<p>${json.result.summary}</p>`;
              //   el.innerHTML = html;
              return json.result;
            } else {
              return null;
            }
          };

          const decoratePopup = (infoObj) => {
            let html = `<h4>${infoObj.title}</h4>`;
            html += `<p>${infoObj.summary}</p>`;
            html += `<a href="https://en.wikipedia.org/?curid=${pageid}" target="_blank">🔗 Link</a>`;
            // html += `<a href="https://en.wikipedia.org/wiki/${infoObj.title}" target="_blank">🔗 Link</a>`;

            speak(infoObj.summary);
            return html;
          };

          let popupInfoObj = null;
          if (title in CACHE_PLACES) {
            popupInfoObj = CACHE_PLACES[title];
            el.innerHTML = decoratePopup(popupInfoObj);
          } else {
            el.innerHTML = `<h4>${title}</h4><p>Loading Wikipedia info... ⏳</p>`;
            getData(`http://127.0.0.1:5000/page_info?title=${title}`)
              .then((d) => {
                popupInfoObj = d;
                CACHE_PLACES[title] = d;
                el.innerHTML = decoratePopup(popupInfoObj);
              })
              .catch((error) => {
                debugger;
                console.error(error);
                //                https://en.wikipedia.org/?curid=70083393
                // TODO: Put correct language
                el.innerHTML = `<h4>${title}</h4><p><a href="https://en.wikipedia.org/?curid=${pageid}" target="_blank">Wikipedia link</a></p>`;
              });
          }
          return el;
        },
        {
          maxWidth: "400",
          width: "200",
        }
      )
      .on("click", markerOnClick);

    markersLayer.addLayer(marker);
  }
};

//updateResponse(exampleData);

const searchLocation = (lat, long) => {
  const url = `http://127.0.0.1:5000/search?lat=${lat}&lon=${long}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      updateResponse(data);
    });
};
debugger;
searchLocation(map.getCenter().lat, map.getCenter().lng);
