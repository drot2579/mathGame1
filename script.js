var timeInter = null

const el = {
    lvl: document.getElementById("lvl"),
    highest: document.getElementById("highest"),
    num1: document.getElementById("num1"),
    num2: document.getElementById("num2"),
    inp: document.getElementById("inp"),
    time: document.getElementById("time"),

    settsCont: document.getElementById("settsCont"),
    tripBar: document.getElementById("tripBar"),
    min: document.getElementById("min"),
    minDisp: document.getElementById("minDisp"),
    max: document.getElementById("max"),
    maxDisp: document.getElementById("maxDisp"),
    timeSett: document.getElementById("timeSett"),
    timeSettDisp: document.getElementById("timeSettDisp"),

    lvlDiv: document.querySelector(".lvlDiv"),
    quesDiv: document.querySelector(".quesDiv"),
    timeDiv: document.querySelector(".timeDiv"),
    highestDiv: document.querySelector(".highestDiv"),
}



const highest = {
    init: localStorage.getItem("highest") || localStorage.setItem("highest", 0),
    get lvl() {
        return localStorage.getItem("highest")
    },
    setLvl(x) {
        localStorage.setItem("highest", x)
    },
    render() {
        el.highest.innerText = highest.lvl
    },
    update(newLevel) {
        highest.setLvl(newLevel)
        highest.render()
    },
    reset() {
        highest.setLvl(0)
        highest.render()
    },
}

const timer = {
    time0: 6000,
    step: 1000,
    time: 6000,
    clr: {
        green1: "hsl(120, 100%, 50%)",
        green2: "hsl(100, 100%, 40%)",
        orange1: "hsl(45, 100%, 45%)",
        orange2: "hsl(30, 100%, 50%)",
        red1: "hsl(20, 100%, 50%)",
        red2: "hsl(00, 100%, 50%)",
    },
    render: function () {
        el.time.innerText = timer.time
        let ratio = timer.time / timer.time0

        ratio < 0.25
            ? (el.time.style.color = timer.clr.red2)
            : ratio < 0.5
                ? (el.time.style.color = timer.clr.orange1)
                : ratio < 0.75
                    ? (el.time.style.color = timer.clr.green2)
                    : (el.time.style.color = timer.clr.green1)
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
        this.current > highest.lvl ? highest.update(this.current) : null
        this.render()
        ques.new()
    },
    reset() {
        this.current = 0
        this.render()
    },
}


// ----- ANIMATIONS START -----

function reverseDirection(anim) {
    return anim.timing.direction == "normal" ? anim.timing.direction = "reverse" : anim.timing.direction = "normal";
}


const divAnim = {
    frames: [
        { transform: "scale(1)" },
        { transform: "scale(1.05)" },
        { transform: "scale(1.05)" },
        { transform: "scale(1)" }
    ],
    timing: { duration: 600 },
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
let res = document.querySelectorAll("main>div")
console.log(res);

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
        this[keys[num]].play()
    },
}



const tripAnim = {
    frames0: [
        { transform: "translateX(0%) translateY(0) rotateZ(0)" },
        { backgroundColor: "yellow", transform: "translateX(0%) translateY(180%) rotateZ(130deg)" },
    ],
    frames1: [
        { transform: "scaleX(1)" },
        { backgroundColor: "yellow", transform: "scaleX(0)" },
    ],
    frames2: [
        { transform: "translateX(0%) translateY(0) rotateZ(0)" },
        { backgroundColor: "yellow", transform: "translateX(0%) translateY(-180%) rotateZ(-130deg)" },
    ],
    timing: {
        duration: 300,
        fill: "forwards",
        direction: "normal",
        easing: "ease"
    },
    targets: el.tripBar.children,
    play() {
        [0, 1, 2].forEach((n) => this.targets.item(n).animate(this["frames" + n], this.timing))
        reverseDirection(this)

    },
}

const settsContAnim = {
    frames: [
        { transform: "translateY(1000px) skewY(70deg)", display: "none" },
        { transform: "translateY(-50px) skewY(2deg)", },
        { transform: "translateY(0px)", display: "flex" },
    ],
    timing: {
        duration: 300,
        fill: "forwards",
        direction: "normal",
        easing: "linear"
    },
    target: el.settsCont,
    play() {
        el.settsCont.animate(settsContAnim.frames, settsContAnim.timing)
        reverseDirection(this)
    },
}

const idleTimer = {
    value: 0,
    step: 1000,
    limit: 10 * 1000,
    interFn: function () {
        // console.log("idle callback called",idle.time);
        idleTimer.value > idleTimer.limit && (autoAnims.playRand(), (idleTimer.value = 0))
        timeInter ? (idleTimer.value = 0) : (idleTimer.value += idleTimer.step)
    },
    init: function () {
        setInterval(this.interFn, this.step)
    },
}

// ----- ANIMATIONS END -----



const game = {
    start() {
        divAnim.init()
        idleTimer.init()
        lvl.reset()
        lvl.up()
        highest.render()
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

// EVENT LISTENERS
{



    el.tripBar.addEventListener("click", (e) => {
        tripAnim.play()
        settsContAnim.play()
    })



    // For minimum number setting
    el.min.addEventListener("input", (e) => {
        ; +el.max.value - +el.min.value < 50 && (el.max.value = +el.min.value + 50)

        el.minDisp.innerText = +el.min.value
        el.maxDisp.innerText = +el.max.value
        number.start = +el.min.value
    })
    // For maximum number setting
    el.max.addEventListener("input", (e) => {
        ; +el.max.value - +el.min.value < 50 && (el.min.value = +el.max.value - 50)

        el.maxDisp.innerText = +el.max.value
        el.minDisp.innerText = +el.min.value

        number.end = +el.max.value - 1
    })
    // For time setting
    el.timeSett.addEventListener("input", (e) => {
        el.timeSettDisp.innerText = e.target.value
        timer.time0 = e.target.value
        timer.time = e.target.value
        timer.render() // ???
    })
    // starts eval when anser is submitted
    el.inp.addEventListener("change", game.evalInput)
    // prevent up-down arrows from submitting
    el.inp.addEventListener("keydown", (e) => {
        ; (e.key == "ArrowUp" || e.key == "ArrowDown") && e.preventDefault()
    })
}


game.start()








/* function adTestBtn(listenerFn) {
    let el = document.createElement("button")
    el.innerText = "test"
    el.style.padding = "1rem 2rem"

    el.addEventListener("click", listenerFn)

    document.body.append(el)

}

adTestBtn(tripAnim.play)
*/