const langJSONurl = "/src/lang.json";
let langObj;

async function getLangObj() {
    try {
        const response = await fetch(langJSONurl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result
    } catch (error) {
        console.error(error.message);
    }
}

async function init(page) {
    alert(location.pathname)
    langObj = await getLangObj();

    if (page == "index") {
        addIcons()
    } else if (page == "portfolio") {
        addDemo()
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
    resultHTML = "";
    icons = langObj.pages.index.id
    for (icon in icons) {
        if (icon == "brand")
            continue
        else {
            resultHTML += `

                    <!-- ${icon} -->`
            if (icons[icon].type == "simple") {
                resultHTML += `
                    <a class="iconGroup col-xl-2 col-lg-3 col-md-4 col-sm-5" href="${icons[icon].href}" target="_blank">
                        <img class="icon" src="icons/${icon}.png"><br>
                        <h5 class="iconText" id="${icon}">${icons[icon].en}</h5>
                    </a>`
            } else if (icons[icon].type == "modal") {
                modalHint = icon + "Hint"
                resultHTML += `
                    <div class="iconGroup col-xl-2 col-lg-3 col-md-4 col-sm-5">
                        <img class="icon" src="icons/${icon}.png" data-bs-toggle="modal" data-bs-target="#${icon}Modal"><br>
                        <h5 class="iconText" id="${icon}">${icons[icon].en}</a>
                    </div>
                    <div class="modal fade" id="${icon}Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="${modalHint}">Save and scan in WeChat</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    ${icons[icon].body}
                                </div>
                            </div>
                        </div>
                    </div>
                    `
            }
        }
    }
    document.getElementById("iconGrid").innerHTML = resultHTML
}

function changeToSetLanguage(page) {
    changeTo(localStorage.getItem('language'), page)
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
            target = target[i]
    }

    // Change page title
    document.title = target.title[lang]

    // Change language for id elements
    for (let key in target.id) {
        document.getElementById(`${key}`).innerHTML = `${target.id[key][lang]}`
        if (page == "index" && target.id[key].type == "modal") {
            document.getElementById(`${key}Hint`).innerHTML = `${target.id[key].hint[lang]}`
        } else if (page == "portfolio" && key != "brand") {
            document.getElementById(`${key}Description`).innerHTML = `${target.id[key].description[lang]}`
        }
    }

    // Change visit button for portfolio
    if (page == "portfolio") {
        let visitElements = document.getElementsByClassName("visit")
        for (let i = 0; i < visitElements.length; i++) {
            visitElements[i].innerHTML = target.visit[lang]
        }
    }
}

function updateSelector(lang) {
    document.getElementById("en").style.textDecoration = "inherit";
    document.getElementById("zh-Hans").style.textDecoration = "inherit";
    document.getElementById(lang).style.textDecoration = "underline";
}

function addDemo() {
    console.log("Adding demos...")
    resultHTML = ""
    demos = langObj.pages.portfolio.id
    for (demo in demos) {
        if (demo == "brand")
            continue
        else {
            resultHTML += `
                <!-- ${demo} -->
                <div class="col">
                    <div class="card w-100 shadow-1-strong rounded mb-4">
                        <img src="../img/${demo}.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title" id="${demo}">${demos[demo].en}</h5>
                            <p class="card-text" id="${demo}Description">${demos[demo].description.en}</p>
                            <a href="${demos[demo].href}" target="_blank" class="btn btn-primary visit">Visit</a>
                        </div>
                    </div>
                </div>
                `
        }
    }
    document.getElementById("collection").innerHTML = resultHTML
}