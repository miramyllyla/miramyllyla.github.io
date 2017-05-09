var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bullet', 'water.png');
    game.load.image('enemyBullet', 'sun.png');
    game.load.spritesheet('invader', 'nature.png', 32, 31);
    game.load.image('ship', 'farmer.png');
    game.load.spritesheet('test','turvemies.png',33,60)
    game.load.spritesheet('left','turvevasen.png',33,59)
    game.load.image('live', 'heart.png');
    game.load.image('kaboom', 'fireball1.png');
    game.load.image('splash', 'splash.png');
    game.load.image('starfield', 'field.png');
    game.load.image('bonus', 'starfield.png');
    game.load.audio('soundi', 'soundi.mp3');
    game.load.audio('shot', 'gunshot.mp3');
    game.load.audio('reload','reload.mp3')
      game.load.audio('bonus','bonusrundi.mp3')

}

var player;
var aliens;
var bullets;
var bulletTime = 0;
var bulletAdd = 200;
var facingRight = true;                             //Character facing right at first
var cursors;
var bonusRound = false
var fireButton;
var reloadButton;
var explosions;
var starfield;
var ship;
var shot;
var spawnSpeed = 1000;
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
var alienSpeed = 200; 
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var enemySpeed = 120;
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
    player = game.add.sprite(400, 500, 'test');
    player.animations.add('walk', [ 0, 1, 2, 3 ], 15, true);
    
    player.play('walk');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();
    
    //  The score 
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '20px Impact', fill: '#ffff99' });
    levelText = game.add.text(10,30,levelString, {font: '20px Impact',fill:'#ffff99'});
    ammoText = game.add.text(650,500,ammoString, {font: '20px Impact',fill:'#ffff99'});

    //  Lives
     lives = game.add.group();
//    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '20px Futura', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '42px Impact', fill: '#000' });
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
    reloadButton = game.input.keyboard.addKey(Phaser.Keyboard.R);
    cursors.left.onDown.add(function(){
        if(facingRight) {
            player.scale.x *= -1;
            facingRight = false;
        }
    },this) 
     cursors.right.onDown.add(function(){
         if(!facingRight) {
             player.scale.x *= -1;
             facingRight = true;
         }
     },this) 
     reloadButton.onDown.add(function(){
        if(!isReloading && player.alive) { reload()}
     },this)
}

function createAliens () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 48, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            var speed = 5;
            if(bonusRound) {
                speed = 40;
            }
            alien.animations.add('fly', [ 0, 1, 2, 3 ], speed, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    aliens.x = 100;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 300 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
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

    aliens.y += 10;

}

function update() {
    if(bonusRound) { game.camera.flash(0xffff99, 300); }
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
            
        }
        

        if (game.time.now > firingTimer)
        {
            enemyFires();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
        if(!bonusRound) { game.physics.arcade.overlap(enemyBullets, bullets, bulletHitsEnemy, null, this); }
    }

}

function reload() {
    isReloading = true;
    load = game.add.audio('reload');
   
    load.play();
   ammoText.text = 'Reloading';
    
       setTimeout(function(){
        if(!bonusRound) {ammo = 20;} else { ammo = 200;}
        ammoText.text = 'Ammo: ' + ammo;
        isReloading= false;
    },2000)
    
}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}
function bulletHitsEnemy(bullet,bull2) {
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

    if (aliens.countLiving() == 0)
    {
        enemySpeed = Math.min(enemySpeed + 30, 500)
        spawnSpeed = Math.max(0,spawnSpeed - 80)
       
        score += 1000;
        scoreText.text = scoreString + score;
        
        enemyBullets.callAll('kill');
        bullets.callAll('kill');
        
        stateText.text = "Level complete! \nClick for next level!";
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
        bullets.callAll('kill');
        enemySpeed = 120;
        spawnSpeed = 1000;
        score = 0;
        ammo= 20;
        bulletAdd = 200;
        currentLevel = 0;
        stateText.text="You died. \nClick to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,enemySpeed);
        firingTimer = game.time.now + spawnSpeed;
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
                



   
            


            ammo = ammo - 1
            if(!ammo == 0) {
                ammoText.text = 'Ammo: ' + ammo 
            } else {
                ammoText.text = 'Press R to reload!'
            }
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + bulletAdd;
            shot = game.add.audio('shot');
            shot.play();
        }
    }

}
 function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    
    
    
    
//  A new level starts
var needsToAdjust = false;
if(bonusRound) {needsToAdjust = true;}
currentLevel += 1
levelText.text = "Level: " + currentLevel;
    if (currentLevel % 3 == 0) {
        bonusRound = true;
        backgroundMusic.stop();
        backgroundMusic = game.add.audio('bonus');
        backgroundMusic.loop = true;
        backgroundMusic.play();
        game.camera.flash(0x000, 7000);
        
        bulletAdd = 50;
        ammo = 200;
        levelText.text = "Bonus round!"
        
        //starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    } else {
        bulletAdd = 200;
        
        if(needsToAdjust) {
            bonusRound = false;
            backgroundMusic.stop();
            backgroundMusic = game.add.audio('soundi');
            backgroundMusic.loop = true;
            backgroundMusic.play();
        }
        ammo = 20;
      //  starfield = game.add.tileSprite(0, 0, 800, 600, 'field');
    }
    ammoText.text = 'Ammo: ' + ammo;
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();
    

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;
}
    

