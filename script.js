
// storage.checkStorage()
{   // global
    var date = null
    var timeInter = null
    var timeStart = 0
    var timeEnd = 0
    var timeStartStr = null
    var timeEndStr = null
    var timeDiff = 0
}

const el = {
    level: document.getElementById("level"),
    highest: document.getElementById("highest"),
    num1: document.getElementById("num1"),
    num2: document.getElementById("num2"),
    input: document.getElementById("input"),
    time: document.getElementById("time"),
}

localStorage.getItem("highest") || localStorage.setItem("highest", 0)
const storage = {
    get level() {return localStorage.getItem("highest")},
    setLevel(x) { localStorage.setItem("highest",x)},
    render() {
        el.highest.innerText = storage.level
    },
    update(newLevel){
        storage.setLevel(newLevel)
        storage.render()
    }
    ,
    reset() {
        storage.setLevel(0)
        storage.render()
    },

}

const number = {
    start: 50,
    end: 99,
    generate() {
        return Math.floor(Math.random() * (this.end - this.start + 1) + this.start)
    }
}

const question = {
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



const level = {
    current: 0,
    render() {
        el.level.innerText = this.current
    },
    up() {
        this.current++
        this.current > storage.level ? storage.update(this.current) : null
        this.render()
        question.new()

    },
    reset() {
        this.current = 0
        this.render()
    },

}


const timer = {
    time0: 6000,
    step: 1000,
    time: 6000,
    intervalObj: null,
    render: function () {
        el.time.innerText = timer.time
    },
    timerFn: function () {
        timer.time -= timer.step
        !timer.time ? game.evalInput() : timer.render()

        // console.log("TimerFn is called");  // dev stage
        // console.log(timer.time);  // dev stage
        // !timer.time ? game.levelUp() : timer.render()
    },
    start: function () {
        timeInter = setInterval(timer.timerFn, timer.step)

        /* dev stage 
            date = new Date
            timeStart = date.getTime()
            timeStartStr = date.toLocaleTimeString()
        */
    },
    reset: function () {

        clearInterval(timeInter)
        timer.time = timer.time0
        timer.render()
        /* dev stage
            date = new Date
            timeEnd = date.getTime()
            timeEndStr = date.toLocaleTimeString()
            timeDiff = timeEnd - timeStart
            console.log(timeDiff);
            console.log(timeStartStr);
            console.log(timeEndStr);
        */
    },

}

const game = {
    start() {
        el.input.addEventListener("change", game.evalInput)
        level.up()
        storage.render()
    },
    levelUp() {
        timer.reset()
        level.up()
        timer.start()

        // question.new()
    },
    over(input) {
        let { num1, num2, answer } = question
        console.log(`GAME OVER\n${num1} ${num2} ${answer}\n${input}`); // in dev
        timer.reset() // needed?
        level.reset()
        level.up()
        // question.new()
    },
    evalInput(e) {
        console.log("'listenInput' is listened");
        let input = el.input.value
        input == question.answer ? game.levelUp() : game.over(input)
        el.input.value = ""

        // let answer = e.target.value
        // e.target.value = ""

    },

}

game.start()




