var timeInter = null

const el = {
    lvl: document.getElementById("lvl"),
    highest: document.getElementById("highest"),
    num1: document.getElementById("num1"),
    num2: document.getElementById("num2"),
    inp: document.getElementById("inp"),
    time: document.getElementById("time"),

    settsCont: document.getElementById("settsCont"),
    settsBtn: document.getElementById("settsBtn"),
    min: document.getElementById("min"),
    minDisp: document.getElementById("minDisp"),
    max: document.getElementById("max"),
    maxDisp: document.getElementById("maxDisp"),
    timeSett: document.getElementById("timeSett"),
    timeSettDisp: document.getElementById("timeSettDisp"),

    lvlDiv: document.getElementById("lvlDiv"),
    quesDiv: document.getElementById("quesDiv"),
    timeDiv: document.getElementById("timeDiv"),
    highestDiv: document.getElementById("highestDiv"),
}

// Open-close Sett Window
el.settsBtn.addEventListener("click", (e) => {
    el.settsCont.classList.toggle("hide")
    el.settsCont.classList.contains("hide") && game.start() // restart game after setts
})
el.min.addEventListener("input", (e) => {
(+el.max.value - +el.min.value < 50) && (el.max.value = +el.min.value + 50)

el.minDisp.innerText = +el.min.value
el.maxDisp.innerText = +el.max.value
number.start = +el.min.value
})
el.max.addEventListener("input", (e) => {
  (+el.max.value - +el.min.value < 50) && (el.min.value = +el.max.value - 50)
  
  el.maxDisp.innerText = +el.max.value
  el.minDisp.innerText = +el.min.value
  
    number.end = +el.max.value - 1
})
el.timeSett.addEventListener("input", (e) => {
    el.timeSettDisp.innerText = e.target.value
    timer.time0 = e.target.value
    timer.time = e.target.value
    timer.render() // ???
})

// ----- ANIMATIONS START -----
const divAnim = {
    frames: [{ transform: "scale(1)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }],
    timing: { duration: 1000 },
    targets: [el.lvlDiv, el.quesDiv, el.timeDiv, el.highestDiv],
    init() {
        this.targets.forEach((div) => {
            div.addEventListener(
                "click",
                (e) => {
                    div.animate(this.frames, this.timing)
                },
                true
            )
        })
    },
}
divAnim.init()

const autoAnims = {
    timeAnim: {
        frames: [{ letterSpacing: "0" }, { letterSpacing: "0.2rem" }, { letterSpacing: "0" }],
        timing: { duration: 500, iterations: 2 },
        target: el.time,
        play() {
            this.target.animate(this.frames, this.timing)
        },
    },
    signAnim: {
        frames: [
            { transform: "rotateZ(1turn)" },
            { transform: "rotateZ(2turn)" },
            { transform: "rotateZ(4turn)" },
            { transform: "rotateZ(7turn)" },
            { transform: "rotateZ(8turn)" },
            { transform: "rotateZ(8.5turn)" },
        ],
        timing: { duration: 3000 },
        target: el.quesDiv.children.namedItem("sign"),
        play() {
            this.target.animate(this.frames, this.timing)
        },
    },
    lvlAnim: {
        frames: [
            { transform: "rotateZ(0deg)" },
            { transform: "rotateZ(20deg)" },
            { transform: "rotateZ(0deg)" },
            { transform: "rotateZ(-20deg)" },
            { transform: "rotateZ(0deg)" },
        ],
        timing: { duration: 1500, iterations: 2 },
        target: el.lvl,
        play() {
            this.target.animate(this.frames, this.timing)
        },
    },
    highestAnim: {
        frames: [
            { transform: "translateY(0rem)" },
            { transform: "translateY(-0.5rem)" },
            { transform: "translateY(0rem)" },
            { transform: "translateY(0rem)" },
        ],
        timing: { duration: 400, iterations: 3 },
        target: el.highest.previousElementSibling,
        play() {
            this.target.animate(this.frames, this.timing)
        },
    },
    playRand() {
        let keys = Object.keys(this)
        let num = Math.floor(Math.random() * (keys.length - 1))
        // console.log(keys);
        // console.log(num);
        this[keys[num]].play()
    },
}

const idle = {
    time: 0,
    step: 1000,
    limit: 45 * 1000,
    interFn: function () {
        // console.log("idle callback called",idle.time);
        idle.time > idle.limit && (autoAnims.playRand(), (idle.time = 0))
        timeInter ? (idle.time = 0) : (idle.time += idle.step)
    },
    init: function () {
        setInterval(this.interFn, this.step)
    },
}
idle.init()

// ----- ANIMATIONS END -----

localStorage.getItem("highest") || localStorage.setItem("highest", 0)
const storage = {
    get lvl() {
        return localStorage.getItem("highest")
    },
    setLevel(x) {
        localStorage.setItem("highest", x)
    },
    render() {
        el.highest.innerText = storage.lvl
    },
    update(newLevel) {
        storage.setLevel(newLevel)
        storage.render()
    },
    reset() {
        storage.setLevel(0)
        storage.render()
    },
}

const timer = {
    time0: 6000,
    step: 1000,
    time: 6000,
    render: function () {
        el.time.innerText = timer.time

        let ratio = timer.time / timer.time0
        let colors = ["hsl(100, 100%, 30%)", "hsl(30, 100%, 50%)", "hsl(20, 100%, 50%)", "hsl(0, 100%, 50%)"]
        console.log(ratio)
        ratio < 0.25
            ? (el.time.style.color = colors[3])
            : ratio < 0.5
            ? (el.time.style.color = colors[1])
            : ratio < 0.75
            ? (el.time.style.color = colors[2])
            : (el.time.style.color = colors[0])
    },
    timerFn: function () {
        timer.time -= timer.step
        timer.time ? timer.render() : game.evalInput()
    },
    start: function () {
        timeInter = setInterval(timer.timerFn, timer.step)
    },
    reset: function () {
        clearInterval(timeInter)
        timer.time = timer.time0
        timer.render()
    },
    colors: {
        green: "#00ff00",
        yellow: "#aaff00",
        orange: "#ffaa00",
        red: "#ff0000",
    },
}

const number = {
    start: 50,
    end: 99,
    generate() {
        return Math.floor(Math.random() * (this.end - this.start + 1) + this.start)
    },
}

const ques = {
    num1: 0,
    num2: 0,
    answer: 0,
    render() {
        // change to forEach?
        el.num1.innerText = this.num1
        el.num2.innerText = this.num2
    },
    new() {
        // change to forEach?
        this.num1 = number.generate()
        this.num2 = number.generate()
        this.answer = this.num1 + this.num2
        this.render()
    },
}

const lvl = {
    current: 0,
    render() {
        el.lvl.innerText = this.current
    },
    up() {
        this.current++
        this.current > storage.lvl ? storage.update(this.current) : null
        this.render()
        ques.new()
    },
    reset() {
        this.current = 0
        this.render()
    },
}

const game = {
    start() {
        el.inp.addEventListener("change", game.evalInput)
        // prevent up-down arrows from submitting
        el.inp.addEventListener("keydown", (e) => {
            ;(e.key == "ArrowUp" || e.key == "ArrowDown") && e.preventDefault()
        })

        lvl.reset()
        lvl.up()
        storage.render()
    },
    lvlUp() {
        timer.reset()
        lvl.up()
        timer.start()

        // ques.new()
    },
    over(inp) {
        let { num1, num2, answer } = ques
        console.log(`GAME OVER\n${num1} ${num2} ${answer}\n${inp}`) // in dev
        timer.reset() // needed?
        lvl.reset()
        lvl.up()
        // ques.new()
    },
    evalInput(e) {
        console.log("'listenInput' is listened")
        // timer.reset()
        let inp = el.inp.value
        inp == ques.answer ? game.lvlUp() : game.over(inp)
        el.inp.value = ""
    },
}

game.start()
