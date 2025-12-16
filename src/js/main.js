const langJSONurl = "./src/lang.json";
let langObj;

async function getLangObj() {
    try {
        const response = await fetch(langJSONurl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
    }
}

async function init(page) {
    langObj = await getLangObj();

    if (page == "index") {
        addIcons();
    } else if (page == "portfolio") {
        addDemo();
    }
    const defaultLang = localStorage.getItem('language');
    if (defaultLang == null) {
        const langNative = navigator.language;
        if (/^zh\b/.test(langNative)) {
            localStorage.setItem('language', 'zh-Hans');
        }
        else {
            localStorage.setItem('language', 'en');
        }
    }
    changeTo(localStorage.getItem('language'), page);
}

function addIcons() {
    console.log("Adding icons...")
    const iconGrid = document.getElementById("iconGrid");
    const dialogs = document.getElementById("dialogs");
    icons = langObj.pages.index.id;
    for (icon in icons) {
        if (icon == "brand")
            continue;
        else {
            if (icons[icon].type == "simple") {
                result = document.getElementById("simple").content.cloneNode(true);
                result.querySelector("a").href = icons[icon].href;
                result.querySelector("img").src = `icons/${icon}.png`;
                result.querySelector(".iconText").id = icon;
                result.querySelector(".iconText").textContent = icons[icon].en;
            } else if (icons[icon].type == "modal") {
                result = document.getElementById("modal").content.cloneNode(true);
                result.querySelector("div").setAttribute('onClick', `document.getElementById('${icon}Dialog').showModal()`);
                result.querySelector(".icon").src = `icons/${icon}.png`;
                result.querySelector(".iconText").id = icon;
                result.querySelector(".iconText").textContent = icons[icon].en;

                resultDialog = document.getElementById("modalDialog").content.cloneNode(true);
                resultDialog.querySelector("dialog").id = icon + "Dialog";
                resultDialog.querySelector("dialog").setAttribute("onClick", `document.getElementById('${icon}Dialog').close()`);
                resultDialog.querySelector("h5").id = icon + "Hint";
                resultDialog.querySelector(".modal-body").innerHTML = `${icons[icon].body}`;

                dialogs.appendChild(resultDialog);
            }
        }
        iconGrid.appendChild(result);
    }
}

function changeToSetLanguage(page) {
    changeTo(localStorage.getItem('language'), page);
}

function changeLanguage(page) {
    let lang = localStorage.getItem('language');
    if (lang == 'en') {
        localStorage.setItem('language', 'zh-Hans');
    } else {
        localStorage.setItem('language', 'en');
    }
    changeTo(localStorage.getItem('language'), page);
}

function changeTo(lang, page) {
    document.documentElement.lang = lang;
    console.log("Changing to " + lang);
    updateSelector(lang);

    let target = langObj.pages;

    // Find the page
    for (const i in target) {
        if (i == page)
            target = target[i];
    }

    // Change page title
    document.title = target.title[lang];

    // Change language for id elements
    for (let key in target.id) {
        document.getElementById(`${key}`).innerHTML = `${target.id[key][lang]}`;
        if (page == "index" && target.id[key].type == "modal") {
            document.getElementById(`${key}Hint`).innerHTML = `${target.id[key].hint[lang]}`;
        } else if (page == "portfolio" && key != "brand") {
            document.getElementById(`${key}Description`).innerHTML = `${target.id[key].description[lang]}`;
        }
    }

    // Change visit button for portfolio
    if (page == "portfolio") {
        let visitElements = document.getElementsByClassName("visit");
        for (let i = 0; i < visitElements.length; i++) {
            visitElements[i].innerHTML = target.visit[lang];
        }
    }
}

function updateSelector(lang) {
    document.getElementById("en").style.textDecoration = "inherit";
    document.getElementById("zh-Hans").style.textDecoration = "inherit";
    document.getElementById(lang).style.textDecoration = "underline";
}

function addDemo() {
    console.log("Adding demos...");
    demos = langObj.pages.portfolio.id;
    for (demo in demos) {
        if (demo == "brand")
            continue;
        else {
            template = document.getElementById("demo").content.cloneNode(true);
            template.querySelector("img").setAttribute('src', `./img/${demo}.png`);
            template.querySelector(".card-title").id = demo;
            template.querySelector(".card-title").textContent = demos[demo].en;
            template.querySelector(".card-text").id = demo + 'Description';
            template.querySelector(".card-text").textContent = demos[demo].description.en;
            template.querySelector("a").href = demos[demo].href;
            
        }
        document.getElementById("collection").appendChild(template);
    }
}