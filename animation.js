$(document).ready( function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    
    
    
    
    // Backround image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    bgImage.src = "taustagalax.jpg";

    
    var testPic = false;    
    var picci = new Image();
    picci.onload = function() {
        testPic = true;
    };
    
    picci.src = "/cat_ani_0/cat_fighter_sprite1.png";
    
    var livesLeft = 10;
    var treatsCaught = 0;
    
    var picEnemy = new Image();
    picEnemy.onload = function() {
        testPic = true;
    };
    picEnemy.src = "/mon1_ani/mon1_sprite.png";
    
    var picTreat = new Image();
    picTreat.onload = function() {
        testPic = true;
    };
    picTreat.src = "kristallit.png";
    

    
    var keysDown = {};
    
    function drawPlayer(context) {
        
        var x = player.x - (player.w / 2);
        var y = player.y - (player.h / 2);
        
        if (player.direction === 0) {  // UP
           context.drawImage(picci, 150, 100, 50, 50, x, y, 50, 50);
        } else if (player.direction === 1) { //RIGHT
           context.drawImage(picci, 200, 200, 50, 50, x, y, 50, 50); 
        } else if (player.direction === 2) { //DOWN
            context.drawImage(picci, 150, 0, 50, 50, x, y, 50, 50);
        } else if (player.direction === 3) {  //LEFT
           context.drawImage(picci, 200, 50, 50, 50, x, y, 50, 50);
        }
     }
    
    
    function drawEnemy(context, enemy) {
        var x = enemy.x - (enemy.w / 2);
        var y = enemy.y - (enemy.h / 2);
           context.drawImage(picEnemy, 0, 0, 45, 45, x, y, 45, 45); 
        }
    
    
    
    function drawTreat(context, treat) {
        var x = treat.x - (treat.w / 2);
        var y = treat.y - (treat.h / 2);
        context.drawImage(picTreat, 0, 0, 30, 30, x, y, 30, 30); 
    }
    
    
    // Reset the game when the player catches a monster
    var resetInMiddle = function (enemi) {
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
    
        // Throw the monster somewhere on the screen randomly
    enemi.x = 32 + (Math.random() * (canvas.width - 64)); 
    enemi.y = 32 + (Math.random() * (canvas.height - 64));
    
    }; 
    
    function reset() {
       enemies.push(addEnemy());
       treats.push(addTreat());
    }
    reset();
    
    window.addEventListener('keydown', function(e) {
        keysDown[e.keyCode] = true;
    });
    
    
    window.addEventListener('keyup', function(e) {
        delete keysDown[e.keyCode];
    });
    
    var arrow_keys_handler = function(e) {
    switch(e.keyCode){
        case 37: case 39: case 38:  case 40: // Arrow keys
        case 32: e.preventDefault(); break; // Space
        default: break; // do not block other keys
    }
    };
    window.addEventListener("keydown", arrow_keys_handler, false);

    
    addEventListener('mousedown', function(e) {
        var x = e.offsetX 
        var y = e.offsetY
        for(i = 0; i<enemies.length;i++) {
            if (enemies[i].x <= x && x<= (enemies[i].x + 50)&& enemies[i].y <= y && y <= (enemies[i].y + 41)) {
                enemies.splice(i, 1)
            }
        }
    })
    
    


    $("#speedDown").click(function() {
        if(player.speed > 5)
        player.speed-=5
    })
    
    $("#speedUp").click(function() {
            player.speed+=5    
    })

    
        
 var collisionTest = function () {
        for (i=0; i < enemies.length; i++) { 
          if ((player.x <= (enemies[i].x + 32))  
           && (enemies[i].x <= (player.x + 32))
           && (player.y <= (enemies[i].y + 32))
           && (enemies[i].y <= (player.y + 32))) {
            --livesLeft; 
            resetInMiddle(enemies[i]);
        }
        }
        };
    
    
    var collisionTreatTest = function () {
        for (i=0; i < treats.length; i++) { 
          if ((player.x <= (treats[i].x + 32))  
           && (treats[i].x <= (player.x + 32))
           && (player.y <= (treats[i].y + 32))
           && (treats[i].y <= (player.y + 32))) {
            ++treatsCaught; 
          resetInMiddle(treats[i]);
        }
        }
        };
   
    
    var render = function () {
        if (bgReady) {
            
            ctx.drawImage(bgImage, 0, 0);
        }
        
        drawPlayer(ctx);
        for (i=0; i < enemies.length; i++) {
            drawEnemy(ctx,enemies[i]);
        }
          for (i=0; i < treats.length; i++) {
            drawTreat(ctx,treats[i]);
        }
        
        // Score
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Futura";
        ctx.textAlign = "middle";
        ctx.textBaseline = "top";
        ctx.fillText("Lives left: " + livesLeft, 32, 32);
        ctx.fillText("Points: " + treatsCaught, 60, 60);
    };
    
    function update() {
        if (38 in keysDown) {
            movePlayer('up');
        }
        
        if (40 in keysDown) {
            movePlayer('down');
        }
        
        if (37 in keysDown) {
            movePlayer('left');
        }
        
        if (39 in keysDown) {
            movePlayer('right');
        }        
        
       moveEnemy();
       moveTreat();
       collisionTest();
       collisionTreatTest();
   };
        
 
  
       
    
    function main() {
        update();              
        render();
        requestAnimationFrame(main);
        if (livesLeft == 0) {
        document.location.reload();
        alert("GAME OVER");
        alert("GAME OVER");
    }
    };
    

    
    main();
    
  
    }
                  
    );