class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.controls = new Controls();

        this.setupCanvas();
        this.initGame();
        this.setupRestartButton();
        this.setupThemeToggle();
    }

    setupCanvas() {
        this.gridSize = 20;
        this.canvas.width = Math.floor(Math.min(window.innerWidth * 0.9, 400) / this.gridSize) * this.gridSize;
        this.canvas.height = this.canvas.width;
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            document.body.classList.toggle('dark-theme');
            // Redraw the game with new colors
            this.draw();
        });
    }

    initGame() {
        this.snake = [{x: 6, y: 6}];
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        this.speed = 200;
        this.lastSpeedIncrease = 0;
        this.updateScore();
        this.gameLoop();
    }

    generateFood() {
        const maxPos = this.canvas.width / this.gridSize - 1;
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * maxPos),
                y: Math.floor(Math.random() * maxPos)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    update() {
        if (this.gameOver) return;

        const direction = this.controls.getDirection();
        const head = {...this.snake[0]};

        switch(direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.endGame();
            return;
        }

        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();

            // Speed increase every 100 points
            if (Math.floor(this.score / 100) > this.lastSpeedIncrease) {
                this.lastSpeedIncrease = Math.floor(this.score / 100);
                this.speed = Math.max(120, this.speed - 10); // Bigger speed decrease every 100 points
            }
        } else {
            this.snake.pop();
        }
    }

    draw() {
        const style = getComputedStyle(document.body);
        this.ctx.fillStyle = style.getPropertyValue('--canvas-bg');
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake with theme-specific colors
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 
                ? style.getPropertyValue('--snake-head')
                : style.getPropertyValue('--snake-body');
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Draw food with theme-specific color
        this.ctx.fillStyle = style.getPropertyValue('--food');
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize/2,
            this.food.y * this.gridSize + this.gridSize/2,
            this.gridSize/2 - 1,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    endGame() {
        this.gameOver = true;
        document.getElementById('gameOver').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;
    }

    setupRestartButton() {
        document.getElementById('restartBtn').addEventListener('click', () => {
            document.getElementById('gameOver').classList.add('hidden');
            this.initGame();
        });
    }

    gameLoop() {
        if (!this.gameOver) {
            this.update();
            this.draw();
            setTimeout(() => requestAnimationFrame(() => this.gameLoop()), this.speed);
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new SnakeGame();
});