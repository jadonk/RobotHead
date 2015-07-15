//Beginning code for reading from stding 
//url:http://stackoverflow.com/questions/20086849/how-to-read-from-stdin-line-by-line-in-node
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});


//Define servo pinouts for neck
var xServo = 'P9_14';
var yServo = 'P9_22';
var duty_min = 0.03;
var xposition = 0.5;
var yposition = 0.7;
var increment = 0.005;
var xmax = 1.0;
var xmin = 0;
var ymax = 1.0;
var ymin = 0;
//The line being read is outputed in this format: +1000 +3089 Where "+1000" is the x value and "+3089" is the y value.
//The x and y values are split and placed into the array below.
var stdin = [0, 0];
var stdintest = false; // set to true to just test the updates without driving the hardware
var printStatus = -1; // set to 0 to enable status printing

if (!stdintest) {
    var b = require('bonescript');
    b.pinMode(xServo, b.ANALOG_OUTPUT);
    b.pinMode(yServo, b.ANALOG_OUTPUT);
}
updateDuty();


//create variable line that holds the values from the current incoming string
rl.on('line', onLine);

function updateDuty() {
    //the code below checks that if the ball is more than 20 units from the center of the screen, then
    //add an increment to the current servo position until it centers.
    if (stdin[0] > 20) {
        xposition = (xposition - increment);
    }
    if (stdin[0] < -20) {
        xposition = (xposition + increment);
    }
    if (stdin[1] < -20) {
        yposition = (yposition + increment);
    }
    if (stdin[1] > 20) {
        yposition = (yposition - increment);
    }
    if (xposition < xmin) xposition = xmin;
    if (xposition > xmax) xposition = xmax;
    if (yposition < ymin) yposition = ymin;
    if (yposition > ymax) yposition = ymax;

    //skip the hardware update if in test mode
    if (stdintest) {
        scheduleNextUpdate();
        return;
    }

    //this section is the same as the beagleboard.org servo code but duplicated for both servos. The top
    //analogWrite() function doesn't include "scheduleNextUpdate" so it doesn't check x/y values twice during the servo update.
    var duty_cycle = (xposition * 0.115) + duty_min;
    b.analogWrite(xServo, duty_cycle, 60);

    var Yduty_cycle = (yposition * 0.115) + duty_min;
    b.analogWrite(yServo, Yduty_cycle, 60, scheduleNextUpdate);
}

function onLine(line) {
    console.log('readline: ' + line);
    //The tracker program used to output *'s to show that the ball was not detected. Originally I had code here to convert
    //the *'s into 0's, but I recently changed the tracker.cpp to output 0's when the ball is not detected, so the code
    //is no longer needed.

    //split the incoming string into it's x and y values.
    stdin = line.split(" ");
}

function scheduleNextUpdate() {
    if (printStatus > 0) {
        printStatus--;
    } else if (printStatus == 0) {
        console.log('position: ' + xposition + ',' + yposition);
        printStatus = 10;
    }
    setTimeout(updateDuty, 10);
}
