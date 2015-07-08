var b = require('bonescript');
var SERVOs = ['P9_14', 'P9_22'];

var duty_min = 0.03;
var position = 0;
var increment = 0.1;

for(s in SERVOs) {
    b.pinMode(SERVOs[s], b.ANALOG_OUTPUT);
}
updateDuty();

function updateDuty() {
    // compute and adjust duty_cycle based on
    // desired position in range 0..1
    var duty_cycle = (position*0.115) + duty_min;
    for(s in SERVOs) {
        b.analogWrite(SERVOs[s], duty_cycle, 60);
    }
    console.log("Duty Cycle: " + 
        parseFloat(duty_cycle*100).toFixed(1) + " %");   
    scheduleNextUpdate();
}

function scheduleNextUpdate() {
    // adjust position by increment and 
    // reverse if it exceeds range of 0..1
    position = position + increment;
    if(position < 0) {
        position = 0;
        increment = -increment;
    } else if(position > 1) {
        position = 1;
        increment = -increment;
    }
    
    // call updateDuty after 200ms
    setTimeout(updateDuty, 200);
}
