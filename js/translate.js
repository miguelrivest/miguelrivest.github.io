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
    let elements = document.querySelectorAll("h1,h2,h3,p,button,a");

    for (let element of elements) {
        if (!element.hasAttribute('noTranslate')) {
            let message = element.innerText;
            translate(message).then(translatedMessage => {
                element.innerText = translatedMessage;
            });
        }
    }
})

englishButton.addEventListener('click', function () {
    let elements = document.querySelectorAll("h1,h2,h3,p");

    for (let element of elements) {
        let message = element.innerText;
        translateEn(message).then(translatedMessage => {
            element.innerText = translatedMessage;
        });
    }
})