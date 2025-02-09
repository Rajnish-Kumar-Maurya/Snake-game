class Controls {
    constructor() {
        this.direction = 'right';
        this.newDirection = 'right';
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.setupControls();
    }

    setupControls() {
        // Touch controls
        document.getElementById('upBtn').addEventListener('touchstart', () => this.setDirection('up'));
        document.getElementById('downBtn').addEventListener('touchstart', () => this.setDirection('down'));
        document.getElementById('leftBtn').addEventListener('touchstart', () => this.setDirection('left'));
        document.getElementById('rightBtn').addEventListener('touchstart', () => this.setDirection('right'));

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.setDirection('up');
                    break;
                case 'ArrowDown':
                    this.setDirection('down');
                    break;
                case 'ArrowLeft':
                    this.setDirection('left');
                    break;
                case 'ArrowRight':
                    this.setDirection('right');
                    break;
            }
        });

        // Swipe controls
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.touchStartX || !this.touchStartY) return;

            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;

            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    this.setDirection('right');
                } else {
                    this.setDirection('left');
                }
            } else {
                if (deltaY > 0) {
                    this.setDirection('down');
                } else {
                    this.setDirection('up');
                }
            }

            this.touchStartX = null;
            this.touchStartY = null;
        });
    }

    setDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (this.direction !== opposites[newDirection]) {
            this.newDirection = newDirection;
        }
    }

    getDirection() {
        this.direction = this.newDirection;
        return this.direction;
    }
}