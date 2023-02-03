class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1'})
    }
//******PRELOAD STATE */
     preload() {
    //preload all the assets
    this.load.image('ball', 'assets/images/ball_32_32.png');
    this.load.image('brick1', 'assets/images/brick1_35_70.png');
    this.load.image('brick2', 'assets/images/brick2_35_70.png');
    this.load.image('brick3', 'assets/images/brick3_35_70.png');
    this.load.image('brick4', 'assets/images/brick4_35_70.png');
    this.load.image('brick5', 'assets/images/brick5_35_70.png');
    this.load.image('paddle', 'assets/images/paddle_35_140.png');
}

//*****CREATE STATE */
    create() {
    //Player Sprite
    gameState.player = this.physics.add.sprite(
        437, //x position
        630, //y position
        'paddle', //key of image sprite
    );

    //Ball Sprite
    gameState.ball = this.physics.add.sprite(
        437, //x position
        595, //y position
        'ball', //key of image sprite
    );

    gameState.blueBricks = this.physics.add.group({
        key: 'brick1',
        repeat: 9, //how many times to repeat sprite
        immovable: true, //tells engine to not let ball lose velocity when hitting brick
        setXY: {
            x: 87,//x cordinate of first sprite
            y: 35, //y cordinate of first sprite
            stepX: 75 //length in pixels between repeated sprites on x-axis
        }
    });

    gameState.redBricks = this.physics.add.group({
        key: 'brick2',
        repeat: 9, //how many times to repeat sprite
        immovable: true, //tells engine to not let ball lose velocity when hitting brick
        setXY: {
            x: 87,//x cordinate of first sprite
            y: 115, //y cordinate of first sprite
            stepX: 75 //length in pixels between repeated sprites on x-axis
        }
    });


    gameState.purpleBricks = this.physics.add.group({
        key: 'brick5',
        repeat: 9, //how many times to repeat sprite
        immovable: true, //tells engine to not let ball lose velocity when hitting brick
        setXY: {
            x: 87,//x cordinate of first sprite
            y: 195, //y cordinate of first sprite
            stepX: 75 //length in pixels between repeated sprites on x-axis
        }
    });

    //add the keyboard keys 
    gameState.cursors = this.input.keyboard.createCursorKeys();

    //HANDLE COLLISION
    //Player Bounds
    gameState.player.setCollideWorldBounds(true); //stops player from leaving bounds
    gameState.ball.setCollideWorldBounds(true); //stops ball from leaving bounds
    this.physics.world.checkCollision.down = false; //disables collision detection with bottom part of world

    gameState.ball.setBounce(1, 1); //tells phaser that it shuld maintain all of it's x and y velocity

    //COLLISION FUNCTIONS
    const hitBrick = (ball, brick) => { //accepts the previous 2 arguments used in collider method
        brick.disableBody(true, true); //make it inactive and hide it from the screen
        
        gameState.score += 1;
        gameState.scoreText.setText((`Score: ${gameState.score}`));

        if (gameState.ball.body.velocity.x == 0) { //if x velocity of ball is 0 then we give the ball a velocity depending on the value of the random number
            let randNum = Math.random();
            if (randNum >= 0.5) {
                gameState.ball.body.setVelocityX(150);
            } else {
                gameState.ball.body.setVelocityX(-150);
            }
        } 
    }

    const hitPlayer = () => {
        //increase the velocity of the ball after it bounces
        gameState.ball.setVelocityY(gameState.ball.body.velocity.y - 5);
    
        let newXVelocity = Math.abs(gameState.ball.body.velocity.x) +5;
        //If the ball is to the left of the player, ensure the x velocity is negative
        if (gameState.ball.x < gameState.player.x) {
            gameState.ball.setVelocityX(-newXVelocity);
        } else {
            gameState.ball.setVelocityX(newXVelocity);
        }
    }
    
    
    //tells phaser's physics system to execute the hitBrick function when the ball collides with various brick sprite groups
    this.physics.add.collider(gameState.ball, gameState.blueBricks, hitBrick);
    this.physics.add.collider(gameState.ball, gameState.redBricks, hitBrick);
    this.physics.add.collider(gameState.ball, gameState.purpleBricks, hitBrick);

    gameState.player.setImmovable(true); //ensure that the player is immovalbe
    this.physics.add.collider(gameState.ball, gameState.player, hitPlayer); //adds collider to ball and player paddle and calls hitplayer method

     //ADD TEXT
     gameState.openingText = this.add.text(
        this.physics.world.bounds.width / 2, //x cordinates
        this.physics.world.bounds.height / 2, //y cordinates
        'Press SPACE to Start',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        },
    );

    //position the opening text
    gameState.openingText.setOrigin(0.5);

    gameState.scoreText = this.add.text(
        20, //x cordinates
        660, //y cordinates
        `Score: 0`,
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '20px',
            fill: '#fff'
        },
    
    );

    gameState.gameOverText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height /2,
        'Game Over',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        },
    );
    gameState.gameOverText.setOrigin(0.5);
    gameState.gameOverText.setVisible(false);

    gameState.playerWonText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height /2,
        'You won!',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        },
    );
    gameState.playerWonText.setOrigin(0.5);
    gameState.playerWonText.setVisible(false);
}


//******UPDATE STATE */
    update() {
        const isGameOver = (world) => {
            return gameState.ball.body.y > world.bounds.height;
        }
            //define winning conditions
        const isWon = () => {
                return gameState.purpleBricks.countActive() +  gameState.redBricks.countActive() +  gameState.blueBricks.countActive() == 0;
            }
    
    //check if ball left the scene (game over)
    if (isGameOver(this.physics.world)) {
        gameState.gameOverText.setVisible(true);
        gameState.ball.disableBody(true, true);
    } else if (isWon()) {
        gameState.gameStarted = false;
        this.scene.stop('Level1');
        this.scene.start('Level2', {score: gameState.score});
    } else {
        //Logic for keys during normal gameplay
        
        //player stays still if no key is pressed
        gameState.player.body.setVelocityX(0);

        //move player left and right
        if (gameState.cursors.left.isDown) {
            gameState.player.body.setVelocityX(-360);
        } else if (gameState.cursors.right.isDown) {
            gameState.player.body.setVelocityX(360);
        } 

        if(!gameState.gameStarted) {
            //if the game hasn't started, set the X cordinate of ball to player's center
            gameState.ball.setX(gameState.player.x);

            if(gameState.cursors.space.isDown) { //if spacebar is down
                gameState.gameStarted = true; //start the game
                gameState.ball.setVelocityY(-200); //and send the ball upwards
                gameState.openingText.setVisible(false); //hides opening text
            }
        }
    }


    }

}