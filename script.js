class TowerOfHanoi {
    constructor() {
        console.log('TowerOfHanoi constructor called');
        this.towers = [[], [], []];
        this.selectedDisk = null;
        this.selectedTower = null;
        this.moveCount = 0;
        this.startTime = Date.now();
        this.gameTimer = null;
        this.isGameWon = false;
        this.isGameStarted = false;
        this.gameMode = null; // 'classic' or 'random'
        this.targetTower = null; // For random mode
        
        this.initializeGame();
        this.setupEventListeners();
        console.log('TowerOfHanoi initialization complete');
    }

    initializeGame() {
        console.log('Initializing game...');
        // Start with 5 disks on the first tower (not randomized yet)
        // With flex-direction: column-reverse, we need largest disk first in array
        this.towers = [
            [5, 4, 3, 2, 1], // Tower 1 (left) - largest to smallest (will display smallest on top)
            [],                // Tower 2 (middle)
            []                 // Tower 3 (right)
        ];
        
        this.moveCount = 0;
        this.startTime = Date.now();
        this.isGameWon = false;
        this.isGameStarted = false;
        this.gameMode = null;
        this.targetTower = null;
        this.clearTargetTowerHighlight();
        this.updateDisplay();
        this.hideWinMessage();
        this.stopTimer();
        console.log('Game initialized with towers:', this.towers);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Tower click events
        document.querySelectorAll('.tower').forEach(tower => {
            tower.addEventListener('click', (e) => this.handleTowerClick(e));
        });

        // Button events
        const classicModeBtn = document.getElementById('classicModeBtn');
        const randomModeBtn = document.getElementById('randomModeBtn');
        const restartBtn = document.getElementById('restartBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        
        console.log('Classic mode button found:', classicModeBtn);
        console.log('Random mode button found:', randomModeBtn);
        console.log('Restart button found:', restartBtn);
        console.log('Play again button found:', playAgainBtn);
        
        if (classicModeBtn) {
            classicModeBtn.addEventListener('click', () => this.startClassicMode());
            console.log('Classic mode button event listener added');
        }
        
        if (randomModeBtn) {
            randomModeBtn.addEventListener('click', () => this.startRandomMode());
            console.log('Random mode button event listener added');
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.restart());
        }

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    handleTowerClick(e) {
        if (this.isGameWon || !this.isGameStarted) return;

        const towerElement = e.currentTarget;
        const towerIndex = parseInt(towerElement.dataset.tower) - 1;

        // Check if clicking on a specific disk
        if (e.target.classList.contains('disk')) {
            const clickedDiskSize = parseInt(e.target.dataset.size);
            const topDisk = this.towers[towerIndex].length > 0 ? this.towers[towerIndex][this.towers[towerIndex].length - 1] : null;
            
            // Only allow selecting if it's the top disk
            if (topDisk === clickedDiskSize) {
                if (this.selectedDisk === null) {
                    this.selectDiskFromTower(towerIndex);
                } else {
                    this.placeDiskOnTower(towerIndex);
                }
            }
            return;
        }

        // If clicking on the tower (not a specific disk), only allow placing
        if (this.selectedDisk !== null) {
            this.placeDiskOnTower(towerIndex);
        }
    }

    selectDiskFromTower(towerIndex) {
        if (this.towers[towerIndex].length === 0) return;

        // Only allow selecting the top disk
        const topDisk = this.towers[towerIndex][this.towers[towerIndex].length - 1];
        this.selectedDisk = topDisk;
        this.selectedTower = towerIndex;
        
        // Visual feedback
        const diskElement = this.getDiskElement(towerIndex, this.selectedDisk);
        if (diskElement) {
            diskElement.classList.add('selected');
        }
    }

    placeDiskOnTower(targetTowerIndex) {
        if (this.selectedDisk === null) return;

        // Check if move is valid
        if (this.isValidMove(targetTowerIndex)) {
            // Remove disk from source tower
            this.towers[this.selectedTower].pop();
            
            // Add disk to target tower
            this.towers[targetTowerIndex].push(this.selectedDisk);
            
            // Update display and move count
            this.moveCount++;
            this.updateDisplay();
            
            // Check for win
            console.log('Checking for win after move...');
            if (this.checkWin()) {
                console.log('WIN CONDITION MET in placeDiskOnTower!');
                this.handleWin();
            }
        } else {
            // Invalid move - shake animation
            const targetTower = document.getElementById(`tower${targetTowerIndex + 1}`);
            targetTower.classList.add('invalid-move');
            setTimeout(() => {
                targetTower.classList.remove('invalid-move');
            }, 500);
        }

        // Clear selection
        this.clearSelection();
    }

    isValidMove(targetTowerIndex) {
        if (targetTowerIndex === this.selectedTower) return false;
        
        const targetTower = this.towers[targetTowerIndex];
        if (targetTower.length === 0) return true;
        
        const topDisk = targetTower[targetTower.length - 1];
        return this.selectedDisk < topDisk;
    }

    clearSelection() {
        if (this.selectedDisk !== null) {
            const diskElement = this.getDiskElement(this.selectedTower, this.selectedDisk);
            if (diskElement) {
                diskElement.classList.remove('selected');
            }
        }
        
        this.selectedDisk = null;
        this.selectedTower = null;
    }

    getDiskElement(towerIndex, diskSize) {
        const tower = document.getElementById(`tower${towerIndex + 1}`);
        const disks = tower.querySelectorAll('.disk');
        return Array.from(disks).find(disk => 
            disk.classList.contains(`disk-${diskSize}`)
        );
    }

    updateDisplay() {
        console.log('=== UPDATE DISPLAY START ===');
        console.log('Updating display...');
        console.log('Current towers state:', this.towers);
        
        // Update move count
        const moveCountElement = document.getElementById('moveCount');
        console.log('Move count element:', moveCountElement);
        if (moveCountElement) {
            moveCountElement.textContent = this.moveCount;
            console.log('Updated move count to:', this.moveCount);
        }
        
        // Clear all towers
        const containers = document.querySelectorAll('.disks-container');
        console.log('Found disk containers:', containers.length);
        containers.forEach((container, index) => {
            console.log(`Clearing container ${index + 1}:`, container);
            container.innerHTML = '';
        });
        
        // Render disks on each tower
        this.towers.forEach((tower, towerIndex) => {
            console.log(`Rendering tower ${towerIndex + 1} with disks:`, tower);
            const container = document.getElementById(`tower${towerIndex + 1}`).querySelector('.disks-container');
            console.log(`Container for tower ${towerIndex + 1}:`, container);
            
            if (container) {
                tower.forEach((diskSize, diskIndex) => {
                    console.log(`  Creating disk ${diskSize} (index ${diskIndex}) for tower ${towerIndex + 1}`);
                    const disk = document.createElement('div');
                    disk.className = `disk disk-${diskSize}`;
                    disk.dataset.size = diskSize;
                    disk.draggable = true;
                    
                    // Add number to disk
                    const number = document.createElement('span');
                    number.className = 'disk-number';
                    number.textContent = diskSize;
                    disk.appendChild(number);
                    
                    console.log(`  Appending disk ${diskSize} to container`);
                    container.appendChild(disk);
                });
            } else {
                console.error(`Container not found for tower ${towerIndex + 1}`);
            }
        });
        
        console.log('=== UPDATE DISPLAY COMPLETE ===');
        console.log('Display updated');
    }

    checkWin() {
        console.log('=== CHECKING WIN CONDITION ===');
        console.log('Game mode:', this.gameMode);
        console.log('Target tower:', this.targetTower + 1);
        console.log('Tower 1 (left):', this.towers[0]);
        console.log('Tower 2 (middle):', this.towers[1]);
        console.log('Tower 3 (right):', this.towers[2]);
        
        if (this.gameMode === 'classic') {
            // Classic mode: all disks must be on the right tower in order
            const isWin = this.towers[2].length === 5 && this.towers[0].length === 0 && this.towers[1].length === 0;
            console.log('Classic mode win condition:', isWin);
            return isWin;
        } else if (this.gameMode === 'random') {
            // Random mode: all disks must be on the target tower in order
            const targetTower = this.towers[this.targetTower];
            const otherTowersEmpty = this.towers.every((tower, index) => 
                index === this.targetTower || tower.length === 0
            );
            const isWin = targetTower.length === 5 && otherTowersEmpty;
            console.log('Random mode win condition:', isWin);
            console.log('Target tower length:', targetTower.length);
            console.log('Other towers empty:', otherTowersEmpty);
            return isWin;
        }
        
        return false;
    }

    handleWin() {
        console.log('=== HANDLING WIN ===');
        console.log('Setting isGameWon to true');
        this.isGameWon = true;
        this.stopTimer();
        
        const finalMovesElement = document.getElementById('finalMoves');
        const finalTimeElement = document.getElementById('finalTime');
        const winMessageElement = document.getElementById('winMessage');
        
        console.log('Final moves element:', finalMovesElement);
        console.log('Final time element:', finalTimeElement);
        console.log('Win message element:', winMessageElement);
        
        if (finalMovesElement) {
            finalMovesElement.textContent = this.moveCount;
            console.log('Set final moves to:', this.moveCount);
        }
        
        if (finalTimeElement) {
            finalTimeElement.textContent = this.getFormattedTime();
            console.log('Set final time to:', this.getFormattedTime());
        }
        
        if (winMessageElement) {
            winMessageElement.classList.remove('hidden');
            console.log('Removed hidden class from win message');
        }
        
        console.log('=== WIN HANDLED ===');
    }

    hideWinMessage() {
        document.getElementById('winMessage').classList.add('hidden');
    }

    startClassicMode() {
        console.log('=== CLASSIC MODE START ===');
        this.gameMode = 'classic';
        this.targetTower = 2; // Right tower (index 3)
        this.isGameStarted = true;
        this.startTimer();
        this.highlightTargetTower();
        console.log('Classic mode started - target tower:', this.targetTower + 1);
    }

    startRandomMode() {
        console.log('=== RANDOM MODE START ===');
        this.gameMode = 'random';
        this.isGameStarted = true;
        this.randomize();
        this.selectRandomTargetTower();
        this.startTimer();
        console.log('Random mode started - target tower:', this.targetTower + 1);
    }

    selectRandomTargetTower() {
        // Select a random tower as the target (excluding empty towers if possible)
        const nonEmptyTowers = this.towers.map((tower, index) => ({ index, count: tower.length }))
            .filter(tower => tower.count > 0);
        
        if (nonEmptyTowers.length > 0) {
            // Prefer towers with disks, but allow any tower
            const randomTower = nonEmptyTowers[Math.floor(Math.random() * nonEmptyTowers.length)];
            this.targetTower = randomTower.index;
        } else {
            // If all towers are empty, pick a random one
            this.targetTower = Math.floor(Math.random() * 3);
        }
        
        this.highlightTargetTower();
        console.log('Selected target tower:', this.targetTower + 1);
    }

    highlightTargetTower() {
        // Remove any existing highlights
        this.clearTargetTowerHighlight();
        
        // Add highlight to target tower
        const targetTowerElement = document.getElementById(`tower${this.targetTower + 1}`);
        if (targetTowerElement) {
            targetTowerElement.classList.add('target-tower');
            console.log('Highlighted target tower:', this.targetTower + 1);
        }
    }

    clearTargetTowerHighlight() {
        document.querySelectorAll('.tower').forEach(tower => {
            tower.classList.remove('target-tower');
        });
    }

    restart() {
        this.stopTimer();
        this.initializeGame();
    }

    randomize() {
        console.log('=== RANDOMIZE START ===');
        console.log('Randomizing disks...');
        this.clearSelection();
        
        // Create a random valid configuration
        const diskSizes = [1, 2, 3, 4, 5];
        this.towers = [[], [], []];
        console.log('Initial empty towers:', this.towers);
        
        // Place disks one by one in valid positions
        for (let i = 0; i < diskSizes.length; i++) {
            const diskSize = diskSizes[i];
            console.log(`Attempting to place disk ${diskSize}...`);
            let placed = false;
            let attempts = 0;
            
            // Try to place the disk, with a maximum number of attempts
            while (!placed && attempts < 20) { // Increased attempts
                const randomTower = Math.floor(Math.random() * 3);
                console.log(`  Attempt ${attempts + 1}: Trying tower ${randomTower + 1}`);
                
                if (this.isValidRandomPlacement(randomTower, diskSize)) {
                    this.towers[randomTower].push(diskSize);
                    placed = true;
                    console.log(`  SUCCESS: Placed disk ${diskSize} on tower ${randomTower + 1}`);
                    console.log(`  Tower ${randomTower + 1} now contains:`, this.towers[randomTower]);
                } else {
                    console.log(`  FAILED: Can't place disk ${diskSize} on tower ${randomTower + 1}`);
                }
                attempts++;
            }
            
            // If we couldn't place it after attempts, force place it on any tower
            if (!placed) {
                console.log(`  Couldn't place disk ${diskSize} after ${attempts} attempts, forcing placement...`);
                // Find any tower where we can place it, or just put it on the first available
                let forcedPlacement = false;
                for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
                    if (this.isValidRandomPlacement(towerIndex, diskSize)) {
                        this.towers[towerIndex].push(diskSize);
                        console.log(`  FORCED: Placed disk ${diskSize} on tower ${towerIndex + 1}`);
                        forcedPlacement = true;
                        break;
                    }
                }
                
                // If still can't place, just put it on the first tower (this should never happen with proper logic)
                if (!forcedPlacement) {
                    this.towers[0].push(diskSize);
                    console.log(`  EMERGENCY: Placed disk ${diskSize} on tower 1`);
                }
            }
        }
        
        console.log('=== RANDOMIZE COMPLETE ===');
        console.log('Final randomized towers:', this.towers);
        this.moveCount = 0;
        this.startTime = Date.now();
        this.isGameWon = false;
        console.log('Calling updateDisplay()...');
        this.updateDisplay();
    }

    isValidRandomPlacement(towerIndex, diskSize) {
        const tower = this.towers[towerIndex];
        if (tower.length === 0) return true;
        
        const topDisk = tower[tower.length - 1];
        return diskSize < topDisk;
    }




    startTimer() {
        console.log('Starting timer...');
        this.startTime = Date.now();
        this.gameTimer = setInterval(() => {
            this.updateTimer();
        }, 1000);
        console.log('Timer started');
    }

    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    updateTimer() {
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeString;
    }

    getFormattedTime() {
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    setupDragAndDrop() {
        // Make disks draggable
        document.addEventListener('dragstart', (e) => {
            console.log('=== DRAGSTART EVENT ===');
            console.log('Dragstart event target:', e.target);
            console.log('Target classes:', e.target.classList);
            console.log('isGameStarted:', this.isGameStarted);
            
            if (!this.isGameStarted) {
                console.log('Game not started, preventing drag');
                e.preventDefault();
                return;
            }
            
            if (!e.target.classList.contains('disk')) {
                console.log('Target is not a disk, preventing drag');
                e.preventDefault();
                return;
            }
            
            console.log('Game is started and target is a disk, processing drag...');
            const diskSize = parseInt(e.target.dataset.size);
            console.log('Disk size:', diskSize);
            const towerIndex = this.getTowerIndexFromDisk(e.target);
            console.log('Tower index:', towerIndex);
            
            if (towerIndex !== -1 && this.towers[towerIndex].length > 0) {
                const topDisk = this.towers[towerIndex][this.towers[towerIndex].length - 1];
                console.log(`Top disk on tower ${towerIndex + 1}: ${topDisk}`);
                console.log(`Dragged disk: ${diskSize}`);
                
                if (topDisk === diskSize) {
                    console.log('This is the top disk, allowing drag');
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        diskSize: diskSize,
                        towerIndex: towerIndex
                    }));
                    e.target.style.opacity = '0.5';
                    console.log('Drag data set and opacity changed');
                } else {
                    console.log('This is not the top disk, preventing drag');
                    e.preventDefault(); // Can't drag non-top disk
                }
            } else {
                console.log('Invalid tower state, preventing drag');
                e.preventDefault();
            }
            console.log('=== DRAGSTART EVENT COMPLETE ===');
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('disk')) {
                e.target.style.opacity = '1';
            }
        });

        // Setup drop zones on towers
        document.querySelectorAll('.tower').forEach(tower => {
            console.log(`Setting up drop zone for tower:`, tower);
            
            tower.addEventListener('dragover', (e) => {
                console.log('Dragover event on tower:', tower.dataset.tower);
                e.preventDefault();
                tower.style.backgroundColor = 'rgba(255,255,255,0.2)';
            });

            tower.addEventListener('dragleave', (e) => {
                console.log('Dragleave event on tower:', tower.dataset.tower);
                tower.style.backgroundColor = '';
            });

            tower.addEventListener('drop', (e) => {
                console.log('=== DROP EVENT ===');
                console.log('Drop event on tower:', tower.dataset.tower);
                e.preventDefault();
                tower.style.backgroundColor = '';
                
                if (!this.isGameStarted) {
                    console.log('Game not started, ignoring drop');
                    return;
                }
                
                console.log('Game is started, processing drop...');
                try {
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    console.log('Drop data:', data);
                    const sourceTowerIndex = data.towerIndex;
                    const targetTowerIndex = parseInt(tower.dataset.tower) - 1;
                    
                    console.log(`Source tower: ${sourceTowerIndex + 1}, Target tower: ${targetTowerIndex + 1}`);
                    
                    if (sourceTowerIndex !== targetTowerIndex) {
                        console.log('Different towers, calling moveDiskWithDrag...');
                        this.moveDiskWithDrag(sourceTowerIndex, targetTowerIndex);
                    } else {
                        console.log('Same tower, ignoring drop');
                    }
                } catch (error) {
                    console.error('Invalid drag data:', error);
                }
                console.log('=== DROP EVENT COMPLETE ===');
            });
        });
    }

    getTowerIndexFromDisk(diskElement) {
        const tower = diskElement.closest('.tower');
        if (tower) {
            return parseInt(tower.dataset.tower) - 1;
        }
        return -1;
    }

    moveDiskWithDrag(fromTowerIndex, toTowerIndex) {
        console.log('=== MOVE DISK WITH DRAG ===');
        console.log(`Moving disk from tower ${fromTowerIndex + 1} to tower ${toTowerIndex + 1}`);
        console.log('Towers before move:', JSON.parse(JSON.stringify(this.towers)));
        
        if (this.towers[fromTowerIndex].length === 0) {
            console.log('Source tower is empty, cannot move');
            return;
        }
        
        const diskToMove = this.towers[fromTowerIndex][this.towers[fromTowerIndex].length - 1];
        console.log(`Disk to move: ${diskToMove}`);
        
        // Check if move is valid
        if (this.isValidMoveForDisk(diskToMove, toTowerIndex)) {
            console.log('Move is valid, executing...');
            
            // Remove disk from source tower
            this.towers[fromTowerIndex].pop();
            console.log(`Removed disk from tower ${fromTowerIndex + 1}`);
            
            // Add disk to target tower
            this.towers[toTowerIndex].push(diskToMove);
            console.log(`Added disk to tower ${toTowerIndex + 1}`);
            
            console.log('Towers after move:', JSON.parse(JSON.stringify(this.towers)));
            
            // Update display and move count
            this.moveCount++;
            console.log(`Move count increased to: ${this.moveCount}`);
            console.log('Calling updateDisplay...');
            this.updateDisplay();
            
            // Check for win
            if (this.checkWin()) {
                console.log('WIN CONDITION MET!');
                this.handleWin();
            }
        } else {
            console.log('Move is invalid, showing shake animation');
            // Invalid move - shake animation
            const targetTower = document.getElementById(`tower${toTowerIndex + 1}`);
            targetTower.classList.add('invalid-move');
            setTimeout(() => {
                targetTower.classList.remove('invalid-move');
            }, 500);
        }
        console.log('=== MOVE DISK WITH DRAG COMPLETE ===');
    }

    isValidMoveForDisk(diskSize, targetTowerIndex) {
        console.log(`  isValidMoveForDisk: diskSize=${diskSize}, targetTowerIndex=${targetTowerIndex}`);
        const targetTower = this.towers[targetTowerIndex];
        console.log(`  Target tower ${targetTowerIndex + 1} contains:`, targetTower);
        
        if (targetTower.length === 0) {
            console.log(`  Tower ${targetTowerIndex + 1} is empty, move is valid`);
            return true;
        }
        
        const topDisk = targetTower[targetTower.length - 1];
        console.log(`  Top disk on tower ${targetTowerIndex + 1}: ${topDisk}`);
        const isValid = diskSize < topDisk;
        console.log(`  Move valid: ${diskSize} < ${topDisk} = ${isValid}`);
        return isValid;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating TowerOfHanoi instance...');
    new TowerOfHanoi();
});
