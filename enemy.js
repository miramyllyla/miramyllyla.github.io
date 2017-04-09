var enemies = [];

function addEnemy() {
    
var enemy = {
       x: Math.floor((Math.random() * 300) + 30),
       y: Math.floor((Math.random() * 300) + 30),
       h: 30,
       w: 30,
       speed: 2,
       direction: 1
    }; 
    
    return enemy;
};
    

for (i=0; i < 5; i++ ) {
    enemies.push(addEnemy());
};
    


    
    function moveEnemy() {
        for (i=0; i < enemies.length; i++) {
            var badEnemy = enemies[i];
            if (badEnemy.x >= 300) {
                badEnemy.direction = 2;
            }
            
            if (badEnemy.x <= 10) {
                badEnemy.direction = 1
            }
            if (badEnemy.direction == 1) {
                badEnemy.x = badEnemy.x + badEnemy.speed;
                
            }
            if (badEnemy.direction == 2) {
                badEnemy.x = badEnemy.x - badEnemy.speed;
            }
            
        }
    };

    
    var stable = 1
    var moving = 2


    function changeSpeed(speed) {
        switch (speed) {
                
        }
    };
    
    

    

