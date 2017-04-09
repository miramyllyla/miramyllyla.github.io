var treats = [];

function addTreat() {
    
var treat = {
       x: Math.floor((Math.random() * 300) + 30),
       y: Math.floor((Math.random() * 300) + 30),
       h: 10,
       w: 10,
       speed: 5,
       direction: 1
    }; 
    
    return treat;
};
    

for (i=0; i < 5; i++ ) {
    treats.push(addTreat());
};
    


    
    function moveTreat() {
        for (i=0; i < treats.length; i++) {
            var treaty = treats[i];
            if (treaty.x >= 300) {
                treaty.direction = 2;
            }
            
            if (treaty.x <= 10) {
                treaty.direction = 1
            }
            if (treaty.direction == 1) {
                treaty.x = treaty.x + treaty.speed;
                
            }
            if (treaty.direction == 2) {
                treaty.x = treaty.x - treaty.speed;
            }
            
        }
    };

    
    var stable = 1
    var moving = 2


    function changeSpeed(speed) {
        switch (speed) {
                
        }
    };
    
    

    

