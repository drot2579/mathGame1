var timeInter = null;

const el = {
  level: document.getElementById("level"),
  highest: document.getElementById("highest"),
  num1: document.getElementById("num1"),
  num2: document.getElementById("num2"),
  input: document.getElementById("input"),
  time: document.getElementById("time"),

  settingsCont: document.getElementById("settingsCont"),
  settingsBtn: document.getElementById("settingsBtn"),
  min: document.getElementById("min"),
  minDisplay: document.getElementById("minDisplay"),
  max: document.getElementById("max"),
  maxDisplay: document.getElementById("maxDisplay"),
  timeSetting: document.getElementById("timeSetting"),
  timeSettingDisplay: document.getElementById("timeSettingDisplay"),
};
// change formchange forminput input
el.settingsBtn.addEventListener("click", (e) => {
  el.settingsCont.classList.toggle("hide");
});

el.min.addEventListener("input", (e) => {
  el.minDisplay.innerText = e.target.value;
  number.start = e.target.value;
  game.start();
});
el.max.addEventListener("input", (e) => {
  el.maxDisplay.innerText = e.target.value;
  number.end = e.target.value - 1;
});
el.timeSetting.addEventListener("input", (e) => {
  el.timeSettingDisplay.innerText = e.target.value;
  timer.time0 = e.target.value;
  timer.time = e.target.value;
  timer.render(); // ???
});

localStorage.getItem("highest") || localStorage.setItem("highest", 0);
const storage = {
  get level() {
    return localStorage.getItem("highest");
  },
  setLevel(x) {
    localStorage.setItem("highest", x);
  },
  render() {
    el.highest.innerText = storage.level;
  },
  update(newLevel) {
    storage.setLevel(newLevel);
    storage.render();
  },
  reset() {
    storage.setLevel(0);
    storage.render();
  },
};

const timer = {
  time0: 6000,
  step: 1000,
  time: 6000,
  render: function () {
    el.time.innerText = timer.time;

    let ratio = timer.time / timer.time0;
    let { red, yellow, orange, green } = timer.colors;
    console.log(ratio);
    ratio < 0.25
      ? (el.time.style.color = red)
      : ratio < 0.5
      ? (el.time.style.color = orange)
      : ratio < 0.75
      ? (el.time.style.color = yellow)
      : (el.time.style.color = green);
  },
  timerFn: function () {
    timer.time -= timer.step;
    timer.time ? timer.render() : game.evalInput();
  },
  start: function () {
    timeInter = setInterval(timer.timerFn, timer.step);
  },
  reset: function () {
    clearInterval(timeInter);
    timer.time = timer.time0;
    timer.render();
  },
  colors: {
    green: "#00ff00",
    yellow: "#aaff00",
    orange: "#ffaa00",
    red: "#ff0000",
  },
};

const number = {
  start: 50,
  end: 99,
  generate() {
    return Math.floor(Math.random() * (this.end - this.start + 1) + this.start);
  },
};

const question = {
  num1: 0,
  num2: 0,
  answer: 0,
  render() {
    // change to forEach?
    el.num1.innerText = this.num1;
    el.num2.innerText = this.num2;
  },
  new() {
    // change to forEach?
    this.num1 = number.generate();
    this.num2 = number.generate();
    this.answer = this.num1 + this.num2;
    this.render();
  },
};

const level = {
  current: 0,
  render() {
    el.level.innerText = this.current;
  },
  up() {
    this.current++;
    this.current > storage.level ? storage.update(this.current) : null;
    this.render();
    question.new();
  },
  reset() {
    this.current = 0;
    this.render();
  },
};

const game = {
  start() {
    el.input.addEventListener("change", game.evalInput);
    // prevent up-down arrows from submitting
    el.input.addEventListener("keydown", (e) => {
      (e.key == "ArrowUp" || e.key == "ArrowDown") && e.preventDefault();
    });

    level.reset();
    level.up();
    storage.render();
  },
  levelUp() {
    timer.reset();
    level.up();
    timer.start();

    // question.new()
  },
  over(input) {
    let { num1, num2, answer } = question;
    console.log(`GAME OVER\n${num1} ${num2} ${answer}\n${input}`); // in dev
    timer.reset(); // needed?
    level.reset();
    level.up();
    // question.new()
  },
  evalInput(e) {
    console.log("'listenInput' is listened");
    // timer.reset()
    let input = el.input.value;
    input == question.answer ? game.levelUp() : game.over(input);
    el.input.value = "";
  },
};

game.start();
