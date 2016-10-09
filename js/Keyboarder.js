function Keyboarder(){
    this.KEYS = {LEFT: 37, UP: 38, RIGHT: 39, SPACE: 32};
    var keyState = {};
    window.addEventListener("keydown", function(e){
        keyState[e.keyCode] = true;
    });
    window.addEventListener("keyup", function(e){
        keyState[e.keyCode] = false;
    });

    this.isDown = function(keyCode){
        return keyState[keyCode];
    };
};