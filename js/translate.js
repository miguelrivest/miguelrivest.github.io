async function translate(text) {
    let res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=AIzaSyCCkawY-abVwke6eFTLLMCgaRj4FkTg-CA`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: text, target: "fr" })
        }
    );
    let data = await res.json();
    let translation = data.data.translations[0].translatedText;
    return translation;
}

async function translateEn(text) {
    let res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=AIzaSyCCkawY-abVwke6eFTLLMCgaRj4FkTg-CA`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: text, target: "en" })
        }
    );
    let data = await res.json();
    let translation = data.data.translations[0].translatedText;
    return translation;
}

let frenchButton = document.getElementById("french");
let englishButton = document.getElementById("english");

frenchButton.addEventListener('click', function () {
    let elements = document.querySelectorAll("h1,h2,h3,p,span,td,th,button,a,footer");

    for (let element of elements) {
        if (!element.hasAttribute('noTranslate')) {
            currentTranslation = element.innerText;
            translate(currentTranslation).then(translatedMessage => {
                element.innerText = parseHtmlEntities(translatedMessage);
            });
        }
    }
});

englishButton.addEventListener('click', function () {
    let elements = document.querySelectorAll("h1,h2,h3,p,span,td,th,button,a,footer");

    for (let element of elements) {
        if (!element.hasAttribute('noTranslate')) {
            currentTranslation = element.innerText;
            translateEn(currentTranslation).then(translatedMessage => {
                element.innerText = parseHtmlEntities(translatedMessage);
            });
        }
    }
});

function getText(element) {
    let childNodes = element.childNodes;
    let text = '';

    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType === Node.TEXT_NODE) {
            text += childNodes[i].textContent;
        }
    }

    return text;
}

function setText(element, text) {
    let childNodes = element.childNodes;

    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType === Node.TEXT_NODE) {
            childNodes[i].textContent = text;
            break;
        }
    }
}

function parseHtmlEntities(text) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(text, 'text/html');
    return doc.body.textContent;
}