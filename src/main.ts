/// <reference path="form.ts"/>

let playerDiv = document.querySelector("#player-display") as HTMLElement
let playerFileDir = "./files/players.json"
let gameFileDir = "./files/games.json"
let playerArray: Array<any>
let gameArray: Array<any>
let gameSelect = document.querySelector("#game-select")! as HTMLSelectElement
let gameType = document.querySelector("#game-type")! as HTMLSelectElement
let gameTypeTitle = document.querySelector("#type-title")! as HTMLElement
let gameTypeArray
let filterDiv = document.querySelector("#filter-container")!
let showFormButton = document.querySelector("#add-player")!
let formBlock = document.querySelector("#form-block")!
let lightToggle = document.querySelector("#toggle-colors")!
let isDarkMode = true
const prefersLightColorScheme = window.matchMedia('(prefers-color-scheme: light)').matches;

showFormButton.addEventListener('click', toggleForm)
gameSelect.addEventListener('change', () => filterPlayers(gameSelect.value, gameType.value))
gameType.addEventListener('change', () => filterPlayers(gameSelect.value, gameType.value))
lightToggle.addEventListener('click', toggleLightMode)

window.onload = loadPlayers

function loadPlayers() {

    // Check if user prefers light mode and toggles it if they do
    if (prefersLightColorScheme) {
        toggleLightMode();
    }

    fetch(playerFileDir)
        .then(res => {
            return res.json()
        }).then(obj => {
            playerArray = obj
            sortArray()
            addPlayersToSite(playerArray)
        }).catch(e => {
            let tempHeading = document.createElement("h3")
            tempHeading.innerHTML = "There was an error while fetching the 'player.json' file. Could not load players."
            playerDiv.appendChild(tempHeading) // Display friendly message for the user
            console.log(e) // This is not here for the user but rather for further investigation by the developers
        })
    loadGames()
}

async function loadGames() {
    fetch(gameFileDir)
        .then(res => {
            return res.json()
        }).then(json => {
            gameArray = json
        }).catch(e => {
            console.log(e) // only for developers, friendly message added below
            gameType.classList.add("hide")
            gameTypeTitle.classList.add("hide")
            alert("Error fetching game.json file, so we have removed the type filtering feature")
        })
}

function addPlayersToSite(json: Array<any>) {
    playerDiv.innerHTML = `<h2>Players: (${json.length} results)</h2>`
    json.forEach(player => {
        // Getting all JSON file data
        let playerId: number = player.id
        let playerFirst: string = player.first_name
        let playerLast: string = player.last_name
        let playerUsername: string = player.username
        let playerEmail: string = player.email
        let playerEnrolled: string = player.enrolled
        let playerAvatarURL: String = player.avatar
        let playerWins: number = player.wins
        let playerLosses: number = player.losses
        let gamesPlayed = player.games_played

        // Create necessary HTML Elements
        let container = document.createElement("div")
        container.classList.add("playerDiv")
        let playerInfo = document.createElement("div")
        let imageDiv = document.createElement("div")
        imageDiv.classList.add("profilePictureContainer")
        let heading = document.createElement("h3")
        let username = document.createElement("p")
        let email = document.createElement("a")
        let enrolmentPara = document.createElement("p")
        let avatar = document.createElement("img")
        let winsPara = document.createElement("p")
        let lossesPara = document.createElement("p")
        let gamesList = document.createElement("ul")

        heading.innerHTML = `(#${playerId}) ${playerLast},&nbsp${playerFirst}`
        username.innerHTML = `Username: ${playerUsername}`
        email.innerHTML = `Email: ${playerEmail}`
        avatar.src = `${playerAvatarURL}`
        enrolmentPara.innerHTML = `Enrolled: ${playerEnrolled}`
        winsPara.innerHTML = `Wins: ${playerWins}`
        lossesPara.innerHTML = `Losses: ${playerLosses}`


        // Adding components to player info div
        playerInfo.innerHTML = "<h4>Player Statistics:</h4>"
        playerInfo.appendChild(username)
        playerInfo.appendChild(email)
        playerInfo.appendChild(enrolmentPara)
        playerInfo.appendChild(winsPara)
        playerInfo.appendChild(lossesPara)
        playerInfo.innerHTML += "<h4>Games Played:</h4>"
        if (Array.isArray(gamesPlayed)) {
            gamesPlayed.forEach(gameEntry => {
                let listItem = document.createElement("li")
                let gameName = getGameName(gameEntry.game)
                listItem.innerHTML = `${gameName} (${gameEntry.date})`
                gamesList.appendChild(listItem)
            })
        } else {
            let gameName = getGameName(gamesPlayed.game)
            let listItem = document.createElement("li")
            listItem.innerHTML = `${gameName} (${gamesPlayed.date})`
            gamesList.appendChild(listItem)
        }
        playerInfo.appendChild(gamesList)


        // Add components to image div
        imageDiv.appendChild(heading)
        imageDiv.appendChild(avatar)

        // Building the main div
        container.appendChild(imageDiv)
        container.appendChild(playerInfo)

        // Add to the player div
        playerDiv.appendChild(container)
    })
}

function sortArray() {
    let sorted
    do {
        sorted = true
        for (let i = 0; i < (playerArray.length - 1); i++) {
            let first: string = playerArray[i].last_name
            let second: string = playerArray[i + 1].last_name
            let comparison: number = first.localeCompare(second)
            if (comparison > 0) {
                swapElements(i, i + 1)
                sorted = false
            }
        }
    } while (!sorted)
}

function swapElements(ind1: number, ind2: number) {
    let tempElement
    tempElement = playerArray[ind1]
    playerArray[ind1] = playerArray[ind2]
    playerArray[ind2] = tempElement
}

function filterPlayers(game: string, type: string) {
    let filterGame = true
    let filterType = true

    // Create a temporary array
    let tempArray = playerArray

    // Check which fields need to be filtered
    if (game == "no-game") {
        filterGame = false
    }
    if (type == "no-type") {
        filterType = false
    }

    if (filterGame) {
        tempArray = tempArray.filter(player => {
            let hasGame = false
            let gamesArray = player.games_played
            if (Array.isArray(gamesArray)) {
                gamesArray.forEach((gameArray: any) => {
                    if (gameArray.game == game) {
                        hasGame = true
                    }
                })
            } else {
                if (gamesArray.game != null) {
                    hasGame = (gamesArray.game == game)
                }
            }
            return hasGame
        })
    }

    if (filterType) {
        tempArray = tempArray.filter(player => {
            let hasType = false
            let gameNames: Array<any> = []
            let gamesArray = player.games_played
            if (Array.isArray(gamesArray)) {
                gamesArray.forEach(playerGame => {
                    gameNames.push(playerGame.game)
                })
            } else {
                gameNames.push(gamesArray.game)
            }
            gameNames.forEach(name => {
                gameArray.forEach((gameEntry) => {
                    if (gameEntry.game == name) {
                        if (gameEntry.type == type) {
                            hasType = true
                        }
                    }
                })
            })
            return hasType
        })
    }

    if (filterGame || filterType) {
        addPlayersToSite(tempArray)
    } else {
        addPlayersToSite(playerArray)
    }

}

function getGameName(systemName: string): String {
    let name = ""
    switch (systemName) {
        case "battleship":
            name = "Battleship"
            break
        case "cribbage":
            name = "Cribbage"
            break
        case "hearts":
            name = "Hearts"
            break
        case "uno":
            name = "Uno"
            break
        case "crazy8s":
            name = "Crazy 8s"
            break
        case "chess":
            name = "Chess"
            break
        case "checkers":
            name = "Checkers"
            break
        case "connect4":
            name = "Connect 4"
            break
        case "war":
            name = "War"
            break
        case "mancala":
            name = "Mancala"
            break
        case "backgammon":
            name = "Backgammon"
            break
        case "dominoes":
            name = "Dominoes"
            break
        default:
            name = "Unknown"
    }
    return name
}

function toggleForm() {
    if (formBlock.classList.contains("hide")) {
        formBlock.classList.remove("hide")
    } else {
        formBlock.classList.add("hide")
        resetForm()
    }
}

function toggleLightMode() {
    if (isDarkMode) {
        lightToggle.innerHTML = "Darkmode"
        isDarkMode = false
        document.documentElement.style.setProperty("--primary", "#dfe0e2");
        document.documentElement.style.setProperty("--secondary", "#272932");
    } else {
        lightToggle.innerHTML = "Lightmode"
        isDarkMode = true
        document.documentElement.style.setProperty("--secondary", "#dfe0e2");
        document.documentElement.style.setProperty("--primary", "#272932");
    }
}