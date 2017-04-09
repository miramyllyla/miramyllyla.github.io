    var player = {
       x: 100,
       y: 100,
       w: 50,
       h: 50,
       speed: 10,
       direction: 0
    };

    var stable = 1
    var toRight = 2
    var toLeft = 3

    
    function movePlayer(direction) {
        switch (direction) {
            case "left":
                player.x -= player.speed;
                if (player.x < 20) {
                    player.x = 20;
                }
                    player.direction = 3;
                break;
            case "right":
                player.x += player.speed;
                if (player.x > 380) {
                    player.x = 380;
                }
                player.direction = 1;
                break;
            case "up":
                player.y -= player.speed;
                if (player.y < 20) {
                    player.y = 20;
                }
                player.direction = 0;
                break;
            case "down":
                player.y += player.speed;
                if (player.y > 380) {
                    player.y = 380;
                }
                 player.direction = 2;
                break;
        }
    };
    
    function changeSpeed(speed) {
        switch (speed) {
                
        }
    };
    

    
