const gameState = {
    score: 0,
    gameStarted: false,
};

// let player, ball, blueBricks, redBricks, greenBricks, yellowBricks, purpleBricks;
// let openingText, gameOverText, playerWonText, scoreText;

//Game Configuration
const config = {
    type: Phaser.AUTO, //tells Phaser what render to use
    parent: 'game', //contains the ID of the HTML element
    width: 875, //width and heigh of game in pixels
    height: 700,
    scale: {
        mode: Phaser.Scale.RESIZE, //tells Phaser how to use the space of our parent element
        autoCenter: Phaser.Scale.CENTER_BOTH //tells phaser how to center our game within our parent div
    },
    physics: { //tells Phaser which Physics engine to use
        default: 'arcade', //3 options: Arcade, Impact, and Matter
        arcade: {
            gravity: false //our game doesn't need gravity
        }
    },
    scene: [Level1, Level2, Level3, Level4, Level5],
};

//Create the game instance
const game = new Phaser.Game(config);

