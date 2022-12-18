const startBtn = document.querySelector("#start")
const screens = document.querySelectorAll('.screen')
const timeList = document.querySelector("#time-list")
const countList = document.querySelector("#dotcount-list")
const formList = document.querySelector("#form-list")
const timeEl = document.querySelector('#time')
const board = document.querySelector('#board')
const tableBtn = document.querySelector('.table-btn')
const playAgainBtn = document.querySelector('.play-btn')
const playerName = document.querySelector('.username-input')
const colors = ['#FEF4C0', '#FDB10B', '#FE8535', '#FD292F', '#B20000', '#005c9d', '#018abd', '#02b9f3', '#93e1ed', '#e2f3fb', '#00003f', '#01008e', '#9001f5', '#fe00ea', '#ff0178']
let scoresArray = []
let lengthSc = 10
let interval
let time = 0
let lastTime = 0
let dotcount = 0
let score = 0
let selectTime = false
let selectCount = false
let selectForm = false
let form = 1
setData(window.localStorage.getItem('scoreTable'))
startBtn.addEventListener('click', (event) => {
    event.preventDefault()
    screens[0].classList.add('up')
})

timeList.addEventListener('click', (event) => {
    if (event.target.classList.contains('time-btn')) {
        const btns = document.querySelectorAll('.time-btn')
        btns.forEach(it => {
            it.classList.remove('active-btn')
        })
        event.target.classList.add('active-btn')
        time = parseInt(event.target.getAttribute('data-time'))
        lastTime = time
        selectTime = true;
        if (selectTime && selectCount && selectForm) {
            screens[1].classList.add('up')
            startGame()
        }
    }
})

countList.addEventListener('click', (event) => {
    if (event.target.classList.contains('dotcount-btn')) {
        dotcount = parseInt(event.target.getAttribute('data-dotcount'))
        const btns = document.querySelectorAll('.dotcount-btn')
        btns.forEach(it => {
            it.classList.remove('active-btn')
        })
        event.target.classList.add('active-btn')
        selectCount = true;
        if (selectTime && selectCount && selectForm) {
            screens[1].classList.add('up')
            startGame()
        }
    }
})

formList.addEventListener('click', (event) => {
    if (event.target.classList.contains('form-btn')) {
        form = parseInt(event.target.getAttribute('data-form'))
        const btns = document.querySelectorAll('.form-btn')
        btns.forEach(it => {
            it.classList.remove('active-btn')
        })
        event.target.classList.add('active-btn')
        selectForm = true;
        if (selectTime && selectCount && selectForm) {
            screens[1].classList.add('up')
            startGame()
        }
    }
})

board.addEventListener('click', (event) => {
    if (event.target.classList.contains('circle')) {
        score++
        event.target.remove()
        createRandomCircle()
    }
})

tableBtn.addEventListener('click', (event) => {
    screens[3].classList.add('up')
    const name = playerName.value
    setTable({
        name,
        score,
        time: lastTime
    })
    
})

playAgainBtn.addEventListener('click', (event) => {
    let elems = document.querySelectorAll('.circle')
    elems.forEach(it => it.remove())
    clearInterval(interval)
    screens[0].classList.remove('up')
    screens[1].classList.remove('up')
    screens[2].classList.remove('up')
    screens[3].classList.remove('up')
    time = 0
    dotcount = 0
    score = 0
    selectTime = false
    selectCount = false
    const btns1 = document.querySelectorAll('.dotcount-btn')
    btns1.forEach(it => {
        it.classList.remove('active-btn')
    })
    const btns2 = document.querySelectorAll('.time-btn')
    btns2.forEach(it => {
        it.classList.remove('active-btn')
    })
    const btns3 = document.querySelectorAll('.form-btn')
    btns2.forEach(it => {
        it.classList.remove('active-btn')
    })
})

function setTable(scored) {
    addScore(scored)
    window.localStorage.setItem('scoreTable', getSaveData())
    setTableData()

}

function startGame() {
    interval = setInterval(decreaseTime, 1000)
    for (let i = 0; i < dotcount; i++)
        createRandomCircle()
    setTime(time)
}

function decreaseTime() {
    if (time === 0) {
        finishGame()
    } else {
        let current = --time
        if (current < 10) current = '0' + current
        setTime(current)
    }
}

function setTime(value) {
    timeEl.innerHTML = `00:${value}`
}

function finishGame() {
    const sco = document.querySelector('.primary')
    sco.textContent = score
    screens[2].classList.add('up')
}

function createRandomCircle() {
    const circle = document.createElement('div')
    const size = getRandomNumber(10, 60)
    const { height, width } = board.getBoundingClientRect()
    const x = getRandomNumber(0, width - size)
    const y = getRandomNumber(0, height - size)

    circle.classList.add('circle')
    if (form == 2) circle.classList.add('square')
    circle.style.width = `${size}px`
    circle.style.height = `${size}px`
    circle.style.top = `${y}px`
    circle.style.left = `${x}px`
    setRandomColor(circle)
    board.append(circle);
}

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function setRandomColor(element) {
    element.style.background = colors[Math.floor(Math.random() * colors.length)]
}

function addScore(scoreRecord) {
    if (scoresArray.length < lengthSc) {
        scoresArray.push(scoreRecord)
        scoresArray.sort((a, b) => b.score - a.score)
    }
    else if (scoresArray[lengthSc - 1].score < scoreRecord.score) {
        scoresArray[lengthSc - 1] = scoreRecord
        scoresArray.sort((a, b) => b.score - a.score)
    }
    return
}
function setTableData() {
    let Table = document.querySelector('table')
    let tbody = document.createElement('tbody')
    for (let i = 0; i < scoresArray.length; i++) {
        let tr = document.createElement('tr')
        let nmbr = document.createElement('td')
        nmbr.textContent = i + 1
        let name = document.createElement('td')
        name.textContent = scoresArray[i].name 
        let time = document.createElement('td')
        time.textContent = scoresArray[i].time + "сек."
        let score = document.createElement('td')
        score.textContent = scoresArray[i].score
        tr.append(nmbr, name, time, score)
        tbody.append(tr)
    }
    Table.append(tbody)
}
function getSaveData() {
    return JSON.stringify({
        scoresArray: scoresArray,
        length: lengthSc
    })
}
function setData(data) {
    if (data) {
        data = JSON.parse(data)
        scoresArray = data.scoresArray
        lengthSc = data.length
        return true
    }
    return false
}