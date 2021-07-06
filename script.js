const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const highScoreBoard = document.querySelector('.highScore')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight

let moveRight = false
let moveLeft = false
let moveUp = false
let moveDown = false

let color = '#D98D00'
let frameInterval = 50
let frame = 49
let obstaclesArray = []
let startX = 100
let heroSpeed = 5
let level = 1
let death = 0
let gameOver = false
let widthofArea = 500
let startPoint = 210
let speed = 6
let finishPoint = widthofArea + startPoint

class Obstacles {
    constructor(x, y, height, direction) {
        this.speed = Math.ceil(Math.random() * speed + 1)
        this.x = x
        this.y = y
        this.width = 10
        this.height = height
        this.direction = direction
    }
    draw(color) {
        ctx.fillStyle = color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    move() {
        if (this.direction === "up") {
            this.y -= this.speed
        } else {
            this.y += this.speed
        }
    }
}

function handleObstaclesUp() {
    let direction = 'up'
    let x = Math.random() * 485 + startPoint
    let height = Math.ceil((Math.random() * 6) + 3) * 10
    obstaclesArray.unshift(new Obstacles(x, canvas.height, height, direction))
    if (obstaclesArray.length > 70) {
        for (let i = 0; i < 20; i++) {
            obstaclesArray.pop([i])
        }
    }
}

function handleObstaclesDown() {
    let direction = 'down'
    let x = Math.random() * 490 + startPoint //100 + startPoint+100
    let height = Math.ceil((Math.random() * 6) + 3) * 10
    obstaclesArray.unshift(new Obstacles(x, 0, height, direction))
    if (obstaclesArray.length > 70) {
        for (let i = 0; i < 20; i++) {
            obstaclesArray.pop([i])
        }
    }
}

class Hero {
    constructor() {
        this.x = startX
        this.y = canvas.height / 2
        this.width = 10
        this.height = 10
    }
    move() {
        if (moveLeft && this.x > 0) {
            this.x -= heroSpeed
        }
        if (moveRight && this.x < canvas.width - this.width - 10) {
            this.x += heroSpeed
        }
        if (moveDown && this.y < canvas.height) {
            this.y += heroSpeed
        }
        if (moveUp && this.y > 0) {
            this.y -= heroSpeed
        }
    }
    draw() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}
let hero = new Hero()

function drawText() {
    if (!gameOver) {
        ctx.fillStyle = "#D98D00"
        ctx.font = "14px Verdana"
        ctx.fillText("Cross to the other side", 10, 20)
        ctx.fillText("---------------------->", 10, 40)
        ctx.fillText("Use keyboard arrows", 10, 60)
        ctx.fillText("Level : " + level, 10, 150)
        ctx.fillText("Death : " + death, 10, 170)
    } else {
        ctx.fillStyle = "red"
        ctx.font = "14px Verdana"
        ctx.fillText("press [SPACE] to continue", 10, 360)
    }
}

function drawArea() {
    ctx.fillStyle = "#111111"
    ctx.fillRect(startPoint, 0, widthofArea, canvas.height)
}

function restart2() {
    color = '#D98D00'
    hero.x = startX
    hero.y = canvas.height / 2
    animate()
}

function restart() {
    hero.x = startX
    hero.y = canvas.height / 2
    if (frameInterval > 20) {
        frameInterval -= 3
    }
}

function checkWithRightSide(obj1, obj2) {
    if (obj1.x > obj2.x - obj1.width + 2 &&
        obj1.x < obj2.x &&
        obj1.y > obj2.y &&
        obj1.y < obj2.y + obj2.height) {
        death++
        gameOver = true
        color = 'red'
    }
}

function checkCollisionWithRightWall() {
    if (hero.x > finishPoint - hero.width / 2) {
        level++
        restart()
    }
}

function checkCollisionWithObstacles() {
    for (let i = 0; i < obstaclesArray.length; i++) {
        checkWithRightSide(hero, obstaclesArray[i])
    }
}

function moveDrawObstacles1() {
    for (let i = 0; i < obstaclesArray.length; i++) {
        obstaclesArray[i].draw(color)
        obstaclesArray[i].move()
    }
}

function animate() {
    frame++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawArea()
    hero.draw()
    hero.move()
    if (frame % frameInterval === 0) {
        handleObstaclesUp()
        handleObstaclesDown()
    }
    checkCollisionWithObstacles()
    drawText()
    moveDrawObstacles1()
    checkCollisionWithRightWall()
    if (!gameOver) {
        requestAnimationFrame(animate)
    }
}

animate()

window.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowLeft') {
        moveLeft = true
    }
    if (e.code === 'ArrowRight') {
        moveRight = true
    }
    if (e.code === 'ArrowDown') {
        moveDown = true
    }
    if (e.code === 'ArrowUp') {
        moveUp = true
    }
})

window.addEventListener('keyup', function (e) {
    if (e.code === 'ArrowLeft') {
        moveLeft = false
    } if (e.code === 'ArrowRight') {
        moveRight = false
    } if (e.code === 'ArrowDown') {
        moveDown = false
    }
    if (e.code === 'ArrowUp') {
        moveUp = false
    }
})

window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && gameOver) {
        gameOver = false
        restart2()
    }
})




