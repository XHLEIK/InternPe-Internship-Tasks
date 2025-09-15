/**
 * Connect Four Game - Professional Implementation
 * Features: 2-player mode, win detection, animations, undo functionality
 * Author: InternPe Task 4
 * Date: September 2025
 */

class ConnectFourGame {
    constructor() {
        // Game constants
        this.ROWS = 6;
        this.COLS = 7;
        this.EMPTY = 0;
        this.PLAYER1 = 1;
        this.PLAYER2 = 2;
        
        // Game state
        this.board = [];
        this.currentPlayer = this.PLAYER1;
        this.gameOver = false;
        this.moveHistory = [];
        this.playerStats = {
            player1: parseInt(localStorage.getItem('connect4-player1-wins') || '0'),
            player2: parseInt(localStorage.getItem('connect4-player2-wins') || '0')
        };
        
        // DOM elements
        this.gameBoard = document.getElementById('game-board');
        this.turnIndicator = document.getElementById('turn-indicator');
        this.turnDisc = document.getElementById('turn-disc');
        this.turnText = document.getElementById('turn-text');
        this.columnPreviews = document.getElementById('column-previews');
        this.columnAreas = document.getElementById('column-areas');
        this.resetBtn = document.getElementById('reset-btn');
        this.undoBtn = document.getElementById('undo-btn');
        this.clearStatsBtn = document.getElementById('clear-stats-btn');
        this.gameMessage = document.getElementById('game-message');
        this.celebrationOverlay = document.getElementById('celebration-overlay');
        this.winnerDisc = document.getElementById('winner-disc');
        this.winnerText = document.getElementById('winner-text');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.player1Wins = document.getElementById('player1-wins');
        this.player2Wins = document.getElementById('player2-wins');
        
        // Initialize game
        this.initializeGame();
        this.bindEvents();
        this.updateStats();
    }
    
    /**
     * Initialize the game board and reset game state
     */
    initializeGame() {
        // Create empty board
        this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(this.EMPTY));
        this.currentPlayer = this.PLAYER1;
        this.gameOver = false;
        this.moveHistory = [];
        
        // Create board cells
        this.createBoard();
        this.updateTurnIndicator();
        this.updateUndoButton();
        this.hideCelebration();
    }
    
    /**
     * Create the visual game board
     */
    createBoard() {
        this.gameBoard.innerHTML = '';
        
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                this.gameBoard.appendChild(cell);
            }
        }
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Column click events
        this.columnAreas.addEventListener('click', (e) => {
            if (e.target.classList.contains('column-area')) {
                const col = parseInt(e.target.dataset.col);
                this.dropDisc(col);
            }
        });
        
        // Column hover events for preview
        this.columnAreas.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('column-area') && !this.gameOver) {
                const col = parseInt(e.target.dataset.col);
                this.showColumnPreview(col);
            }
        });
        
        this.columnAreas.addEventListener('mouseout', () => {
            this.hideColumnPreviews();
        });
        
        // Control buttons
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.undoBtn.addEventListener('click', () => this.undoMove());
        this.clearStatsBtn.addEventListener('click', () => this.clearStats());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            const col = parseInt(e.key) - 1;
            if (col >= 0 && col < this.COLS) {
                this.dropDisc(col);
            } else if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            } else if (e.key === 'u' || e.key === 'U') {
                this.undoMove();
            }
        });
        
        // Close celebration on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.celebrationOverlay.classList.contains('show')) {
                this.hideCelebration();
            }
        });
    }
    
    /**
     * Drop a disc in the specified column
     */
    dropDisc(col) {
        if (this.gameOver || !this.isValidMove(col)) {
            this.showMessage('Invalid move!', 'error');
            return;
        }
        
        const row = this.getLowestEmptyRow(col);
        if (row === -1) {
            this.showMessage('Column is full!', 'error');
            return;
        }
        
        // Add move to history for undo functionality
        this.moveHistory.push({ row, col, player: this.currentPlayer });
        
        // Update board state
        this.board[row][col] = this.currentPlayer;
        
        // Create falling animation
        this.animateDiscDrop(row, col, this.currentPlayer);
        
        // Update visual board after animation
        setTimeout(() => {
            this.updateCell(row, col, this.currentPlayer);
            this.checkWin(row, col);
            
            if (!this.gameOver) {
                this.switchPlayer();
                this.updateTurnIndicator();
            }
            
            this.updateUndoButton();
        }, 500);
    }
    
    /**
     * Animate disc falling into position
     */
    animateDiscDrop(targetRow, col, player) {
        const template = document.getElementById('falling-disc-template');
        const fallingDisc = template.cloneNode(true);
        const disc = fallingDisc.querySelector('.falling-disc');
        
        fallingDisc.style.display = 'block';
        fallingDisc.style.position = 'absolute';
        fallingDisc.style.pointerEvents = 'none';
        fallingDisc.style.zIndex = '1000';
        
        // Position the falling disc
        const boardRect = this.gameBoard.getBoundingClientRect();
        const cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
        const cellGap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-gap'));
        
        const startX = boardRect.left + 20 + col * (cellSize + cellGap);
        const startY = boardRect.top - cellSize - 10;
        const endY = boardRect.top + 20 + targetRow * (cellSize + cellGap);
        
        fallingDisc.style.left = startX + 'px';
        fallingDisc.style.top = startY + 'px';
        
        // Style the disc
        disc.classList.add(player === this.PLAYER1 ? 'player1' : 'player2');
        
        // Add to document
        document.body.appendChild(fallingDisc);
        
        // Animate falling
        setTimeout(() => {
            fallingDisc.style.transition = 'top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            fallingDisc.style.top = endY + 'px';
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(fallingDisc);
        }, 600);
    }
    
    /**
     * Update a specific cell's visual state
     */
    updateCell(row, col, player) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.remove('player1', 'player2');
            if (player !== this.EMPTY) {
                cell.classList.add(player === this.PLAYER1 ? 'player1' : 'player2');
            }
        }
    }
    
    /**
     * Check if a move is valid
     */
    isValidMove(col) {
        return col >= 0 && col < this.COLS && this.board[0][col] === this.EMPTY;
    }
    
    /**
     * Get the lowest empty row in a column
     */
    getLowestEmptyRow(col) {
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (this.board[row][col] === this.EMPTY) {
                return row;
            }
        }
        return -1;
    }
    
    /**
     * Switch to the next player
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.PLAYER1 ? this.PLAYER2 : this.PLAYER1;
    }
    
    /**
     * Update the turn indicator
     */
    updateTurnIndicator() {
        this.turnDisc.className = `turn-disc ${this.currentPlayer === this.PLAYER1 ? 'player1-turn' : 'player2-turn'}`;
        this.turnText.textContent = `Player ${this.currentPlayer}'s Turn`;
    }
    
    /**
     * Show column preview on hover
     */
    showColumnPreview(col) {
        this.hideColumnPreviews();
        
        if (!this.isValidMove(col)) return;
        
        const preview = this.columnPreviews.children[col];
        preview.classList.add('show');
        preview.classList.add(this.currentPlayer === this.PLAYER1 ? 'player1' : 'player2');
    }
    
    /**
     * Hide all column previews
     */
    hideColumnPreviews() {
        Array.from(this.columnPreviews.children).forEach(preview => {
            preview.classList.remove('show', 'player1', 'player2');
        });
    }
    
    /**
     * Check for win condition
     */
    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],   // Horizontal
            [1, 0],   // Vertical
            [1, 1],   // Diagonal /
            [1, -1]   // Diagonal \
        ];
        
        for (const [deltaRow, deltaCol] of directions) {
            const winningCells = this.checkDirection(row, col, deltaRow, deltaCol, player);
            if (winningCells.length >= 4) {
                this.handleWin(player, winningCells);
                return;
            }
        }
        
        // Check for draw
        if (this.isBoardFull()) {
            this.handleDraw();
        }
    }
    
    /**
     * Check for wins in a specific direction
     */
    checkDirection(row, col, deltaRow, deltaCol, player) {
        const cells = [[row, col]];
        
        // Check in positive direction
        let r = row + deltaRow;
        let c = col + deltaCol;
        while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
            cells.push([r, c]);
            r += deltaRow;
            c += deltaCol;
        }
        
        // Check in negative direction
        r = row - deltaRow;
        c = col - deltaCol;
        while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
            cells.unshift([r, c]);
            r -= deltaRow;
            c -= deltaCol;
        }
        
        return cells;
    }
    
    /**
     * Handle win condition
     */
    handleWin(player, winningCells) {
        this.gameOver = true;
        this.highlightWinningCells(winningCells);
        
        // Update stats
        if (player === this.PLAYER1) {
            this.playerStats.player1++;
        } else {
            this.playerStats.player2++;
        }
        this.saveStats();
        this.updateStats();
        
        // Show celebration
        setTimeout(() => {
            this.showCelebration(player);
        }, 1000);
    }
    
    /**
     * Handle draw condition
     */
    handleDraw() {
        this.gameOver = true;
        this.showMessage("It's a draw! The board is full.", 'info');
        
        setTimeout(() => {
            this.showCelebration(0); // 0 indicates draw
        }, 1000);
    }
    
    /**
     * Highlight winning cells
     */
    highlightWinningCells(cells) {
        cells.forEach(([row, col]) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('winning');
            }
        });
    }
    
    /**
     * Check if board is full
     */
    isBoardFull() {
        return this.board[0].every(cell => cell !== this.EMPTY);
    }
    
    /**
     * Undo the last move
     */
    undoMove() {
        if (this.moveHistory.length === 0 || this.gameOver) return;
        
        const lastMove = this.moveHistory.pop();
        const { row, col } = lastMove;
        
        // Remove from board
        this.board[row][col] = this.EMPTY;
        
        // Update visual
        this.updateCell(row, col, this.EMPTY);
        
        // Switch back to previous player
        this.switchPlayer();
        this.updateTurnIndicator();
        this.updateUndoButton();
        
        this.showMessage('Move undone!', 'info');
    }
    
    /**
     * Update undo button state
     */
    updateUndoButton() {
        this.undoBtn.disabled = this.moveHistory.length === 0 || this.gameOver;
    }
    
    /**
     * Reset the game
     */
    resetGame() {
        this.initializeGame();
        this.showMessage('New game started!', 'success');
    }
    
    /**
     * Show celebration overlay
     */
    showCelebration(winner) {
        if (winner === 0) {
            // Draw
            this.winnerText.textContent = "It's a Draw!";
            this.winnerDisc.style.background = 'linear-gradient(45deg, var(--player1-color), var(--player2-color))';
        } else {
            this.winnerText.textContent = `Player ${winner} Wins!`;
            this.winnerDisc.style.background = winner === this.PLAYER1 ? 'var(--player1-color)' : 'var(--player2-color)';
            this.winnerDisc.style.color = winner === this.PLAYER1 ? 'var(--player1-glow)' : 'var(--player2-glow)';
        }
        
        this.celebrationOverlay.classList.add('show');
    }
    
    /**
     * Hide celebration overlay
     */
    hideCelebration() {
        this.celebrationOverlay.classList.remove('show');
    }
    
    /**
     * Show temporary message
     */
    showMessage(text, type = 'info') {
        const messageText = this.gameMessage.querySelector('.message-text');
        const messageIcon = this.gameMessage.querySelector('.message-icon');
        
        messageText.textContent = text;
        
        // Set icon based on type
        let icon = 'fas fa-info-circle';
        if (type === 'success') icon = 'fas fa-check-circle';
        else if (type === 'error') icon = 'fas fa-exclamation-circle';
        
        messageIcon.className = `message-icon ${icon}`;
        
        // Show message
        this.gameMessage.className = `game-message ${type} show`;
        
        // Hide after 3 seconds
        setTimeout(() => {
            this.gameMessage.classList.remove('show');
        }, 3000);
    }
    
    /**
     * Update player statistics display
     */
    updateStats() {
        this.player1Wins.textContent = `${this.playerStats.player1} Win${this.playerStats.player1 !== 1 ? 's' : ''}`;
        this.player2Wins.textContent = `${this.playerStats.player2} Win${this.playerStats.player2 !== 1 ? 's' : ''}`;
    }
    
    /**
     * Save statistics to localStorage
     */
    saveStats() {
        localStorage.setItem('connect4-player1-wins', this.playerStats.player1.toString());
        localStorage.setItem('connect4-player2-wins', this.playerStats.player2.toString());
    }
    
    /**
     * Clear all statistics
     */
    clearStats() {
        if (confirm('Are you sure you want to clear all statistics?')) {
            this.playerStats.player1 = 0;
            this.playerStats.player2 = 0;
            this.saveStats();
            this.updateStats();
            this.showMessage('Statistics cleared!', 'info');
        }
    }
}

/**
 * Utility Functions
 */

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new ConnectFourGame();
    
    // Add some visual polish
    addVisualEnhancements();
    
    // Console welcome message
    console.log(`
    🎮 Connect Four Game Loaded Successfully!
    
    🎯 How to Play:
    • Click on columns to drop discs
    • Use number keys 1-7 for quick column selection
    • Press 'R' to reset the game
    • Press 'U' to undo the last move
    
    🏆 Goal: Connect four discs in a row (horizontal, vertical, or diagonal)
    
    ✨ Features:
    • Smooth animations
    • Undo functionality
    • Persistent statistics
    • Responsive design
    • Keyboard controls
    
    Good luck and have fun! 🎉
    `);
});

/**
 * Add visual enhancements and polish
 */
function addVisualEnhancements() {
    // Add subtle background pattern animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes backgroundShift {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(10deg); }
        }
        
        body {
            animation: backgroundShift 20s infinite;
        }
        
        .game-board::before {
            animation: patternShift 15s infinite linear;
        }
        
        @keyframes patternShift {
            0% { transform: translateX(0); }
            100% { transform: translateX(20px); }
        }
    `;
    document.head.appendChild(style);
    
    // Add touch support for mobile devices
    addTouchSupport();
    
    // Add sound effects (optional - uncomment if you want sound)
    // addSoundEffects();
}

/**
 * Add touch support for mobile devices
 */
function addTouchSupport() {
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        // Prevent scrolling while interacting with the game
        const touchY = e.touches[0].clientY;
        const gameContainer = document.querySelector('.game-container');
        
        if (gameContainer && gameContainer.contains(e.target)) {
            e.preventDefault();
        }
    }, { passive: false });
}

/**
 * Optional: Add sound effects (requires audio files)
 * Uncomment and add audio files to enable
 */
function addSoundEffects() {
    const sounds = {
        drop: new Audio('sounds/drop.mp3'),
        win: new Audio('sounds/win.mp3'),
        error: new Audio('sounds/error.mp3')
    };
    
    // Preload sounds
    Object.values(sounds).forEach(sound => {
        sound.preload = 'auto';
        sound.volume = 0.3;
    });
    
    // Add sound triggers
    document.addEventListener('discDropped', () => {
        sounds.drop.play().catch(() => {}); // Ignore errors
    });
    
    document.addEventListener('gameWon', () => {
        sounds.win.play().catch(() => {});
    });
    
    document.addEventListener('invalidMove', () => {
        sounds.error.play().catch(() => {});
    });
}

/**
 * Performance optimization for older devices
 */
function optimizePerformance() {
    // Reduce animations on low-performance devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--transition-normal', '0.1s');
        document.documentElement.style.setProperty('--transition-slow', '0.2s');
    }
    
    // Use requestAnimationFrame for smooth animations
    let animationId;
    function smoothAnimations() {
        // Perform any continuous animations here
        animationId = requestAnimationFrame(smoothAnimations);
    }
    smoothAnimations();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// Initialize performance optimizations
optimizePerformance();
