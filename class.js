class Anix {
    frames = []
    timing = { duration, direction, fill, easing }
    targets = []
    constructor() {
    }
    reverseDirection() {
        return this.timing.direction == "normal" ? this.timing.direction = "reverse" : this.timing.direction = "normal";
    }
    play() {
        this.targets.forEach(el => {el.animate(this.frames,this.timing)})
    }
}