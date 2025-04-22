/* Background Images */
const BODY = document.body;
const BG_IMAGES = [
    // North America
    "images/sanFrancisco.png",
    "images/vancouver.png",
    "images/losAngeles.png",
    "images/lasVegas.png",
    "images/houston.png",
    "images/chicago.png",
    "images/newYork.png",
    "images/miami.png",
    "images/mexicoCity.png",

    // South America
    "images/bogota.png",
    "images/rioDeJaneiro.png",
    "images/buenosAires.jpg",
    "images/santiago.png",

    // Europe
    "images/madrid.jpg",
    "images/london.jpg",
    "images/stockholm.jpg",
    "images/berlin.jpg",
    "images/paris.jpeg",
    "images/rome.png",
    "images/moscow.jpg",
    "images/istanbul.png",

    // Africa
    "images/cairo.jpg",
    "images/lagos.jpg",
    "images/kinshasa.jpg",
    "images/johannesburg.jpg",
    "images/darEsSalaam.jpg",

    // Asia
    "images/riyadh.jpg",
    "images/dubai.jpg",
    "images/tehran.jpg",
    "images/newDelhi.jpg",
    "images/thailand.jpg",
    "images/beijing.jpg",
    "images/seoul.jpg",
    "images/tokyo.jpg",
    "images/japan.jpg",
    "images/hongKong.jpg",
    "images/hoChiMinhCity.jpeg",
    "images/manila.jpg",
    
    // Australia
    "images/sydney.jpg",

    // Antarctica
    "images/antarctica.jpg",

    // Earth 
    "images/milkyWay.jpg", 
    "images/jungle.jpeg",
    "images/waterfall.jpg",
    "images/desert.jpg",
    "images/coralReef.jpg",
    "images/mountains.jpg",
];

const BG_CONTAINER = document.createElement("div");
BG_CONTAINER.style.position = "fixed";
BG_CONTAINER.style.top = "0";
BG_CONTAINER.style.left = "0";
BG_CONTAINER.style.width = "100%";
BG_CONTAINER.style.height = "100%";
BG_CONTAINER.style.zIndex = "-100"; 
BODY.insertBefore(BG_CONTAINER, BODY.firstChild); 

function chooseRandomBgImg() {
    const RANDOM_INDEX = Math.floor(Math.random() * BG_IMAGES.length);
    const RANDOM_IMG_SRC = BG_IMAGES[RANDOM_INDEX];

    const IMG = new Image();
    IMG.src = RANDOM_IMG_SRC;
    IMG.style.position = "absolute";
    IMG.style.top = "0";
    IMG.style.left = "0";
    IMG.style.width = "100%";
    IMG.style.height = "100%";
    IMG.style.objectFit = "cover";
    IMG.style.opacity = "34%";

    while (BG_CONTAINER.firstChild) {
        BG_CONTAINER.removeChild(BG_CONTAINER.firstChild);
    }
    BG_CONTAINER.appendChild(IMG);
}

chooseRandomBgImg();

/* Weather */
const API_KEY = "13f4bea4ed2b2e865bd47a961b9335a0";
