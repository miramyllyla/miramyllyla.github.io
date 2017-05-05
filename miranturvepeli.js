var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bullet', 'water.png');
    game.load.image('enemyBullet', 'sun.png');
    game.load.spritesheet('invader', 'nature.png', 32, 31);
    game.load.image('ship', 'farmer.png');
    game.load.image('live', 'heart.png');
    game.load.image('kaboom', 'fireball1.png');
    game.load.image('splash', 'splash.png');
    game.load.image('starfield', 'field.png');
    game.load.image('bonus', 'starfield.png');
    game.load.audio('soundi', 'soundi.mp3');
  //  game.load.bitmapFont('fontti', 'fontti.png', 'fontti.xml');

}

var player;
var turpeet; //prev. aliens
var bullets;
var bulletTime = 0;
var bulletAdd = 200;
var cursors;
var bonusRound = false
var fireButton;
var reloadButton;
var explosions;
var starfield;
var ship;
var isReloading;
var ammo = 20;
var score = 0;
var scoreString = '';
var scoreText;
var ammoString = 'Ammo: ' + ammo
var ammoText;
var currentLevel = 1;
var levelString = 'Level: ' + currentLevel;
var levelText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var enemySpeed = 120
var gitTest;
function create() {

   
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    backgroundMusic = game.add.audio('soundi');
    backgroundMusic.loop = true;
    backgroundMusic.play();
    

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    
 
    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    turpeet = game.add.group();
    turpeet.enableBody = true;
    turpeet.physicsBodyType = Phaser.Physics.ARCADE;

    createTurpeet();
    
    //  The score 
    scoreString = 'Score: ';
    scoreText = game.add.text(20, 20, scoreString + score,{ font: '20px Impact ', fill: '#ffff99' });
    levelText = game.add.text(20, 50,levelString, {font: '20px Impact',fill:'#ffff99'});
    ammoText = game.add.text(20,550,ammoString, {font: '20px Impact',fill:'#ffff99'});

    //  Lives
     lives = game.add.group();
//    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '20px Futura', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '42px Impact', fill: '#ffff99' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 110 + (35 * i), 35, 'live');
        ship.anchor.setTo(0.5, 0.5);
       // ship.angle = ;
        ship.alpha = 0.4;

    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.createMultiple(30, 'splash');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    reloadButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    
}

function createTurpeet () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var turve = turpeet.create(x * 48, y * 50, 'invader');
            turve.anchor.setTo(0.5, 0.5);
            var speed = 5;
            if(bonusRound) {
                speed = 40;
            }
            turve.animations.add('fly', [ 0, 1, 2, 3 ], speed, true);
            turve.play('fly');
            turve.body.moves = false;
        }
    }

    turpeet.x = 100;
    turpeet.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(turpeet).to( { x: 300 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
 //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
}




function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('splash');
    invader.animations.add('kaboom');

}

function descend() {

    turpeet.y += 10;

}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;
    //ship.tilePosition.x += 2;
    if (player.alive)
    {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown && player.x > 30)
        {
            player.body.velocity.x = -200;
        }
        if (cursors.right.isDown && player.x < 770)
        {
            player.body.velocity.x = 200;
        }
         if (cursors.up.isDown && player.y > 30)
        {
            player.body.velocity.y = -200;
        }
         if (cursors.down.isDown && player.y < 570 )
        {
            player.body.velocity.y = 200;
        }

        //  Firing?
        if (fireButton.isDown&& ammo > 0 && !isReloading)
        {
            
            fireBullet();
            
        } else if (reloadButton.isDown) {
            reload();
        }
        

        if (game.time.now > firingTimer)
        {
            enemyFires();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets, turpeet, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
        if(!bonusRound) { game.physics.arcade.overlap(enemyBullets, bullets, bulletHitsEnemy, null, this); }
    }

}

function reload() {
    isReloading = true;
    
   ammoText.text = 'Reloading...';
    
       setTimeout(function(){
        ammo = 20;
        ammoText.text = 'Ammo: ' + ammo;
        isReloading= false;
    },2000)
    
}

function render() {

    // for (var i = 0; i < turpeet.length; i++)
    // {
    //     game.debug.body(turpeet.children[i]);
    // }

}
function bulletHitsEnemy(bullet,alien) {
    bullet.kill()
}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('splash', 30, false, true);

    if (turpeet.countLiving() == 0)
    {
        enemySpeed = Math.min(enemySpeed + 200, 800)
        if (bonusRound) {
            bulletAdd = 50;
        } else
        {
            bulletAdd == 200;
        }
        score += 1000;
        scoreText.text = scoreString + score;
        
        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click for next level!";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');
        enemySpeed = 120;
        score = 0;
        bulletAdd = 200;
        currentLevel = 0;
        stateText.text="  \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    turpeet.forEachAlive(function(turve){

        // put every living enemy in an array
        livingEnemies.push(turve);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,enemySpeed);
        firingTimer = game.time.now + 500;
    }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            ammo = ammo - 1
            if(!ammo == 0) {
                ammoText.text = 'Ammo: ' + ammo 
            } else {
                ammoText.text = 'Press shift to reload!'
            }
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + bulletAdd;
        }
    }

}
 function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    currentLevel += 1
    if (currentLevel % 3 == 0) {
        bonusRound = true;
        bulletAdd = 50;
        //starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    } else {
        bulletAdd = 200;
        bonusRound = false;
      //  starfield = game.add.tileSprite(0, 0, 800, 600, 'field');
    }
    levelText.text = "Level: " + currentLevel;
    //resets the life count
    lives.callAll('revive');
    //  And brings the turpeet back from the dead :)
    turpeet.removeAll();
    createTurpeet();
    

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;
}

