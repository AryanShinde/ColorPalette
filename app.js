const colorsDivs = document.querySelectorAll(".color");
const hexText = document.querySelectorAll(".controls h2");
const generateBtn = document.querySelector(".generate");
const allSliders = document.querySelectorAll(".sliders");
const copyBox = document.querySelector(".copy-container");
const sliderCancel = document.querySelectorAll(".close-adjustment");
const adjustmentButtons = document.querySelectorAll(".adjust");
const lockbtns = document.querySelectorAll(".lock");

//localstorage variable:
let localPalettes = [];

let initialcolors;

allSliders.forEach((slider, index) => {
    slider.addEventListener("input", hslcontrol);
    slider.addEventListener("change", (e) => {
        updateText(index, e);
    });
});
document.addEventListener("DOMContentLoaded", generateColor);

generateBtn.addEventListener("click", function () {
    generateColor();
    setTimeout(() => {
        generateColor();
    }, 200)
    setTimeout(() => {
        generateColor();
    }, 400)

});
hexText.forEach((hex) => {
    hex.addEventListener("click", () => {
        copyToClipboard(hex);
    });

});
sliderCancel.forEach((slider, index) => {
    slider.addEventListener("click", () => {
        allSliders[index].classList.remove("down");
    })
})
adjustmentButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        allSliders[index].classList.toggle("down");
    })
})
lockbtns.forEach((lock) => {
    lock.addEventListener("click", () => {
        lock.parentElement.parentElement.classList.toggle("locked");
        console.log(lock.parentElement.parentElement);
        if (lock.parentElement.parentElement.classList.contains("locked")) {
            lock.innerHTML = `<i class="fas fa-lock"></i>`;

        } else {
            lock.innerHTML = `<i class="fas fa-lock-open"></i>`;
        }
    })
})


function hexCode() {
    // let hex="0123456789ABCDEF";
    // let code="#";
    // for(let i=0;i<6;i++)
    // {
    //     code+=hex[Math.floor(Math.random()*16)];
    // }
    let code = chroma.random();
    return code;
}

function generateColor() {
    initialcolors = [];
    colorsDivs.forEach(function (color, index) {
        const random = hexCode();
        const hext = color.children[0].children[0];
        if (color.classList.contains("locked")) {
            initialcolors.push(hext.innerText);
            return;

        } else {
            initialcolors.push(random);
        }
        console.log("working?");
        hext.innerText = random;
        color.style.background = random;
        checkText(random, hext);

        const sliders = color.querySelectorAll(".sliders input");

        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        const hexcolor = chroma(random);

        colorizesliders(hexcolor, hue, brightness, saturation);

    });

    updateInput();
    colorsDivs.forEach((div, index) => {
        const buttons = div.querySelectorAll(".controls button");
        buttons.forEach((button) => {
            checkText(initialcolors[index], button);
        })
    })
}

function colorizesliders(color, hue, brightness, saturation) {
    const nosat = color.set("hsl.s", 0);
    const sat = color.set("hsl.s", 1);
    const scalesat = chroma.scale([nosat, color, sat]);
    //scale brightness
    const midbright = color.set("hsl.l", 0.5);
    const scaleBright = chroma.scale(["black", midbright, "white"]);
    //updating input color
    saturation.style.backgroundImage = `linear-gradient(to right,${scalesat(0)},${scalesat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;

}


function checkText(color, text) {
    const lumi = chroma(color).luminance();
    if (lumi > 0.5) {
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}

function hslcontrol(e) {
    const index = e.target.getAttribute("data-sat") || e.target.getAttribute("data-bright") || e.target.getAttribute("data-hue");
    const bgColor = initialcolors[index];
    const bgtext = colorsDivs[index].children[0].children[0];
    const slider = e.target.parentElement.querySelectorAll("input[type=range]");
    const hue = slider[0];
    const brightness = slider[1];
    const saturation = slider[2];

    const newcolor = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);
    colorsDivs[index].style.background = newcolor;
    colorizesliders(newcolor, hue, brightness, saturation);
}

function updateText(index, e) {
    const color = e.target.parentElement.parentElement.style.backgroundColor;
    const newColor = ((chroma(color).hex()));
    const text = e.target.parentElement.parentElement.querySelector("h2");
    text.innerText = newColor;
    const icons = e.target.parentElement.parentElement.querySelectorAll(".controls button")
    icons.forEach((icon) => {
        checkText(newColor, icon)
    })
    checkText(newColor, text)
}

function updateInput() {
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach((slider) => {
        if (slider.name === "hue") {
            const color = initialcolors[slider.getAttribute("data-hue")]
            const huecolor = chroma(color).hsl()[0];
            slider.value = Math.floor(huecolor);
        }
        if (slider.name === "Brightness") {
            const color = initialcolors[slider.getAttribute("data-bright")];
            const brightcolor = chroma(color).hsl()[2];
            slider.value = (brightcolor);

        }
        if (slider.name === "Saturation") {
            const color = initialcolors[slider.getAttribute("data-sat")];
            const satcolor = chroma(color).hsl()[1];
            slider.value = (satcolor);

        }
    })
}

function copyToClipboard(hex) {
    const element = document.createElement("textarea");
    element.value = hex.innerText;
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
    copyBox.classList.add("active");
    copyBox.children[0].classList.add("active");

    copyBox.addEventListener("click", () => {
        copyBox.classList.remove("active");
        copyBox.children[0].classList.remove("active");
    })
}

//Saving the palette and LOCAL STORAGE STUFFS
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const saveContainer = document.querySelector(".save-container");
const savePopup = document.querySelector(".save-popup");
const saveClose = document.querySelector(".save-popup button");
const saveInput = document.querySelector(".save-popup input");
const libraryContainer = document.querySelector(".library-container");
const libraryPopup = document.querySelector(".library-popup");
const libraryClose = document.querySelector(".close-library");
const libraryBtn = document.querySelector(".library");

saveBtn.addEventListener("click", openSave);
saveClose.addEventListener("click", closeSave);
libraryBtn.addEventListener("click", openLibrary);
libraryClose.addEventListener("click", closeLibrary);

function openLibrary() {
    libraryContainer.classList.add('active');
    libraryPopup.classList.add("active");
}

function closeLibrary() {
    libraryContainer.classList.remove('active');
    libraryPopup.classList.remove("active");
}

function openSave() {
    saveContainer.classList.add("active");
    savePopup.classList.add("active");

}

function closeSave() {
    saveContainer.classList.remove("active");
    savePopup.classList.add("fade");
    savePopup.classList.remove("active");
}

//ADDING TO LOCAL STORAGE

submitSave.addEventListener("click", savePalettes);

function savePalettes() {
    const value = saveInput.value;
    const colors = [];
    hexText.forEach((hex) => {
        colors.push(hex.innerText);
    });
    const number = localPalettes.length;
    const paletteObject = {
        name: value,
        color: colors,
        number: number
    };
    saveToLocals(paletteObject);
    saveInput.value = "";
    createLibrary(paletteObject);

}

function saveToLocals(paletteObject) {
    if (localStorage.getItem("palettes") == null) {
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObject);
    localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function createLibrary(paletteObject) {
    const newPalette = document.createElement("div");
    newPalette.classList.add("palette-container");

    const name = document.createElement("div");
    name.classList.add("name");
    name.innerText = paletteObject.name;
    const palette = document.createElement("div")
    palette.classList.add("palette");
    paletteObject.color.forEach(color => {
        const colordiv = document.createElement("div");
        colordiv.style.background = color;
        palette.appendChild(colordiv);
    })
    const selectBtn = document.createElement("button");
    selectBtn.classList.add("select-btn");
    selectBtn.classList.add(paletteObject.number);
    selectBtn.innerText = "Select";
    newPalette.appendChild(name);
    newPalette.appendChild(palette);
    newPalette.appendChild(selectBtn)
    libraryPopup.appendChild(newPalette);

}