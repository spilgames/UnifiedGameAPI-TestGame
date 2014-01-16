var stage = new Kinetic.Stage({
    container: 'game-container',
    width: 640,
    height: 480,
    fill: '#ccc'
});

var layer = new Kinetic.Layer();

var button = new Kinetic.Group({
    x: 260,
    y: 30,
    width: 120,
    height: 30
});

var rect = new Kinetic.Rect({
    width: 120,
    height: 30,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 1,
    cornerRadius: 5
});

var buttonLabel = new Kinetic.Text({
    text: 'Enter your bet',
    fontSize: 16,
    fontFamily: 'Calibri',
    fill: 'white',
    width: 120,
    y: 7
});

var betLabel = new Kinetic.Text({
    fontSize: 16,
    fontFamily: 'Calibri',
    fill: 'black',
    y: 70,
    width: 640
});

var rouletteLabel = new Kinetic.Text({
    fontSize: 50,
    fontFamily: 'Calibri',
    fill: 'black',
    y: 150,
    width: 640
});

var resultLabel = new Kinetic.Text({
    fontSize: 100,
    fontFamily: 'Calibri',
    fill: 'black',
    y: 300,
    width: 640
});

buttonLabel.align('center');
betLabel.align('center');
rouletteLabel.align('center');
resultLabel.align('center');

button.on('mouseover', function() {
    document.body.style.cursor = 'pointer';
});

button.on('mouseout', function() {
    document.body.style.cursor = 'default';
});

button.on('click', function() {
    betLabel.setText('');
    rouletteLabel.setText('');
    resultLabel.setText('');
    layer.draw();

    var bet = window.prompt('Enter the number you want to bet on (between 0 and 100):');

    if(bet) {
        betLabel.setText('You are betting on: ' + bet);
        betLabel.align('center');
        layer.draw();

        var count = 0,
            result;

        var getRandomResult = setInterval(function() {
            if(count < 20) {
                result = Math.round(Math.random() * 100);
                count++;
                rouletteLabel.setText(result);
                rouletteLabel.align('center');
                layer.draw();
            } else {
                clearInterval(getRandomResult);
                var message = '';
                if(result === bet) {
                    message = 'You won!';
                } else {
                    message = 'You lost :(';
                }

                resultLabel.setText(message);
                resultLabel.align('center');
                layer.draw();
            }
        }, 100);

        
    }
});

button.add(rect);
button.add(buttonLabel);

// add the shape to the layer
layer.add(button);
layer.add(betLabel);
layer.add(rouletteLabel);
layer.add(resultLabel);

// add the layer to the stage
stage.add(layer);