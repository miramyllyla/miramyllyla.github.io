var current = localStorage.getItem("lastname");
console.log("get" + current);
if (current == null) { 
    var current = 0;
}
else { 
    current = parseInt(current);
}

window.onload = function() {
    
var aIndex = 0;
var aData = null;
var play = true;

$.getJSON("https://myllylm2.firebaseio.com/.json", function(data){
    console.log(data);
    aData = data;
})

function next() {
  localStorage.setItem("lastname", current);
  switch(current) {
      case 0:
          current = 1;
          break;
      case 1:
          current = 2;
          break;
      case 2:
          current = 0;
          break;
  }
   /* $.when($(".uutiskuvat").fadeIn(1000)).done($(".uutiskuvat").fadeOut(1000));
    $(".panel").html("<img class ='uutiskuvat' src='" + aData.articles[current].picture + "'>"); */
    
    $(".uutiskuvat").fadeIn(1000);
    $(".panel").html("<img class ='uutiskuvat' src='" + aData.articles[current].picture + "'>");
    $(".uutiskuvat").fadeOut(1000); 
  
}
    
function previous() {
    localStorage.setItem("lastname", current);
    switch(current) {
        case 0:
            current = 2;
            break;
        case 1:
            current = 0;
            break;
        case 2:
            current = 1;
            break;   
    }
    $(".uutiskuvat").fadeIn(1000);
    $(".panel").html("<img class ='uutiskuvat' src='" + aData.articles[current].picture + "'>");
    $(".uutiskuvat").fadeOut(1000);
}


function toggle() {
    if (play) {
        clearInterval(loop);
        play = false;
        $("#pause").hide();
        $("#play").show();
    } else {
        loop = setInterval( function() { 
            next();
        }, 1500);
        play = true;
        $("#play").hide();
        $("#pause").show();
     //   document.getElementById("btn_playPause").style.background-image="url(../contents/img/losAudio_pause.png)";

    }
}
    
var loop = setInterval( function() {  
    console.log("luuppi");
            next();
        }, 1500);

$("#previous").click(function() {
    previous();
})

$("#pause").click(function() {
    toggle();
})

$("#play").click(function() {
    toggle();
})

$("#next").click(function() {  
    next();
})


}