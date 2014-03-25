// declare a global var at the top of your script
// that will hold the api instance once loaded
var API;

// API-related methods
// These methods work for both games

function _triggerMidroll(count, callbacks) {
    if (count % 2 === 0) {
        API.GameBreak.request(callbacks.pause, callbacks.resume);
    }
}

function _getLogo() {
    return API.Branding.getLogo();
}

function _listLinks() {
    return API.Branding.listLinks();
}

function _getLink(type) {
    return API.Branding.getLink(type);
}

function _getSplashScreen() {
    return API.Branding.getSplashScreen();
}

/* Technology-specific implementation */

if(document.getElementById('game-container-canvas')) {

    // CANVAS VERSION
    (function(K, A) {

        var game,
            SpilLogo,
            layer,
            btn,
            moreBtn,
            betLabel,
            rouletteLabel,
            resultLabel,
            cashLabel,
            cash = 2500,
            betAmount = 50,
            playCount = 0;

        /* Game related methods */
        function _createStage(containerId, width, height) {
            return new K.Stage({
                container: containerId,
                width: width,
                height: height
            });
        }

        function _createLayer() {
            return new K.Layer();
        }

        function _createSplashScreen(splashData, callback) {
            var splashLayer = _createLayer(),
                imageObj = new Image();

            imageObj.src = '/img/zibbo.gif';

            imageObj.onload = function() {
                var splash = new Kinetic.Image({
                    x: 0,
                    y: 0,
                    image: imageObj,
                    width: 640,
                    height: 480
                });

                splash.on('mouseover', function() {
                    document.body.style.cursor = 'pointer';
                });

                splash.on('mouseout', function() {
                    document.body.style.cursor = 'default';
                });

                splash.on('click', splashData.action);

                splashLayer.add(splash);

                callback.call(this, splashLayer);
            };
        }

        function _createLogo(data, callback) {
            var imageObj = new Image(),
                logoData = data;

            if (logoData.image) {
                imageObj.src = logoData.image;

                imageObj.onload = function() {
                    var logo = new Kinetic.Image({
                        x: 0,
                        y: 10,
                        image: imageObj,
                        width: logoData.width,
                        height: logoData.height
                    });

                    callback.call(this, logo, logoData.action);
                };
            } else {
                callback.call(this, null, null);
            }
        }

        function _createMoreButton() {
            var button = new K.Group({
                x: 20,
                y: 430,
                width: 100,
                height: 30
            }),
            rect = new K.Rect({
                width: 100,
                height: 30,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 1,
                cornerRadius: 5
            }),
            buttonLabel = new K.Text({
                text: 'More Games',
                fontSize: 16,
                fontFamily: 'Calibri',
                fill: 'white',
                width: 100,
                y: 7
            }).align('center');

            button.add(rect);
            button.add(buttonLabel);

            return button;
        }

        function _createBetButton() {
            var button = new K.Group({
                x: 260,
                y: 30,
                width: 120,
                height: 30
            }),
            rect = new K.Rect({
                width: 120,
                height: 30,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 1,
                cornerRadius: 5
            }),
            buttonLabel = new K.Text({
                text: 'Enter your bet',
                fontSize: 16,
                fontFamily: 'Calibri',
                fill: 'white',
                width: 120,
                y: 7
            }).align('center');

            button.add(rect);
            button.add(buttonLabel);

            return button;
        }

        function _createBetLabel() {
            return new K.Text({
                fontSize: 16,
                fontFamily: 'Calibri',
                fill: 'white',
                y: 70,
                width: 640
            }).align('center');
        }

        function _createRouletteLabel() {
            return new K.Text({
                fontSize: 50,
                fontFamily: 'Calibri',
                fill: 'white',
                y: 150,
                width: 640
            }).align('center');
        }

        function _createResultLabel() {
            return new K.Text({
                fontSize: 100,
                fontFamily: 'Calibri',
                fill: 'white',
                y: 300,
                width: 640
            }).align('center');
        }

        function _createCashLabel() {
            return new K.Text({
                text: 'Your cash: $' + cash,
                fontSize: 20,
                fontFamily: 'Calibri',
                fill: 'white',
                width: 600,
                y: 30,
                x: 20
            }).align('right');
        }

        function initCanvasGame(containerId, width, height) {
            game = _createStage(containerId, width, height);
            layer = _createLayer();
            btn = _createBetButton();
            betLabel = _createBetLabel();
            rouletteLabel = _createRouletteLabel();
            resultLabel = _createResultLabel();
            cashLabel = _createCashLabel();

            function displayGame() {
                btn.on('mouseover', function() {
                    document.body.style.cursor = 'pointer';
                });

                btn.on('mouseout', function() {
                    document.body.style.cursor = 'default';
                });

                btn.on('click', function() {
                    if(cash === 0) {
                        window.alert('You cannot bet, you have no more cash!');
                        return false;
                    }

                    betLabel.setText('');
                    rouletteLabel.setText('');
                    resultLabel.setText('');
                    layer.draw();

                    var bet = window.prompt('Enter the number you want to bet on (between 0 and 36):');

                    if(bet) {
                        if(bet > 36) {
                            window.alert('You can only bet on numbers betwen 0 and 36! You bet on: ' + bet);
                            return false;
                        }

                        betLabel.setText('You are betting on: ' + bet);
                        betLabel.align('center');
                        layer.draw();

                        var count = 0,
                            result;

                        var getRandomResult = setInterval(function() {
                            if(count < 20) {
                                result = Math.round(Math.random() * 36);
                                count++;
                                rouletteLabel.setText(result);
                                rouletteLabel.align('center');
                                layer.draw();
                            } else {
                                clearInterval(getRandomResult);

                                var message = '';
                                if(result === parseInt(bet)) {
                                    message = 'You won!';
                                    cash += betAmount;
                                } else {
                                    message = 'You lost :(';
                                    cash -= betAmount;
                                }

                                resultLabel.setText(message);
                                resultLabel.align('center');
                                cashLabel.setText('Your cash: $' + cash);
                                cashLabel.align('right');
                                layer.draw();

                                // update the play count
                                playCount++;
                                // This is how you can trigger midrolls every other play
                                _triggerMidroll(playCount, {
                                    pause: function() {
                                        console.log('Midroll requested');
                                    },
                                    resume: function() {
                                        console.log('Midroll finished');
                                    }
                                });
                            }
                        }, 100);
                    }
                });

                // add the elements to the layer
                layer.add(cashLabel);
                layer.add(btn);
                layer.add(betLabel);
                layer.add(rouletteLabel);
                layer.add(resultLabel);
                
                /**
                 * Example on how to generate a 'more games' button
                 */
                
                var moreBtnAction = _getLink('more_games');

                if(!moreBtnAction.error && moreBtnAction.action) { // will return an error msg if the button is not available
                    moreBtn = _createMoreButton();
                    moreBtn.on('mouseover', function() {
                        document.body.style.cursor = 'pointer';
                    });

                    moreBtn.on('mouseout', function() {
                        document.body.style.cursor = 'default';
                    });

                    moreBtn.on('click', moreBtnAction.action);

                    layer.add(moreBtn);
                }

                /**
                 * Example on how to get a logo
                 */

                var getLogoData = _getLogo();

                if(!getLogoData.error && getLogoData.action && getLogoData.image) {
                    // Create the logo
                    _createLogo(getLogoData, function(logo, action) {
                        // setup events listeners for the logo
                        logo.on('mouseover', function() {
                            document.body.style.cursor = 'pointer';
                        });

                        logo.on('mouseout', function() {
                            document.body.style.cursor = 'default';
                        });

                        logo.on('click', action);

                        // Add the logo to the layer
                        layer.add(logo);

                        // Finally, refresh the game UI with the logo included (franework-specific)
                        game.add(layer);
                    });
                }

                // show background image
                document.getElementById(containerId).style.background = "url('/img/background.jpg')";
                // show the game
                game.add(layer);
            }
            
            // check for splash screen
            var splashData = _getSplashScreen();

            // if the spalsh screen is enabled, show the splash screen for two seconds
            if(splashData.show) {
                _createSplashScreen(splashData, function(splash) {
                    game.add(splash);
                    window.setTimeout(function() {
                        game.clear();
                        displayGame();
                    }, 2000);
                });
            } else {
                // else , display the game directly
                displayGame();
            }
            
        }

        // Load the API
        A.loadAPI(function(instance) {
            // init the game
            console.log('API loaded in the game', instance);
            API = instance;
            initCanvasGame('game-container-canvas', 640, 480);
        });

    })(Kinetic, GameAPI);

} else if(document.getElementById('game-container-dom')) {

    //DOM version
    (function(A) {
        function initDOMGame() {
            // DOM VERSION
            var cash = 2500,
                bet = null,
                betAmount = 50,
                result = null,
                playCount = 0,
                game = document.getElementById('game-container-dom'),
                resultField = document.getElementById('result'),
                msgField = document.getElementById('message'),
                betLabel = document.getElementById('bet-label'),
                betField = document.getElementById('bet-label-span'),
                cashField = document.getElementById('cash-amount'),
                betBtn = document.getElementById('bet-btn'),
                moreGamesBtn = document.getElementById('more-games-btn'),
                logo = _getLogo(),
                moreGames = _getLink('more_games');

            if(logo.image && logo.action) {
                var logoEl = document.createElement('img'),
                    logoCell = document.getElementById('logo-cell');

                logoEl.src = logo.image;
                logoEl.id = 'spil-logo';
                logoEl.addEventListener('click', logo.action);

                logoCell.appendChild(logoEl);
            }

            if(moreGames.action) {
                moreGamesBtn.addEventListener('click', moreGames.action);
                moreGamesBtn.classList.remove('hidden');
            }

            betBtn.addEventListener('click', function() {
                if(cash === 0) {
                    alert('You are out of cash!');
                    return false;
                } else {
                    msgField.classList.add('hidden');
                    resultField.classList.add('hidden');
                    bet = window.prompt('Enter the number you want to bet on (between 0 and 36):');
                    if(bet) {
                        if(bet > 36) {
                            window.alert('You can only bet on numbers betwen 0 and 36! You bet on: ' + bet);
                            return false;
                        }

                        resultField.classList.remove('hidden');

                        var count = 0;

                        var getRandomResult = setInterval(function() {
                            if(count < 20) {
                                result = Math.round(Math.random() * 36);
                                resultField.innerHTML = result;
                                count++;
                            } else {
                                clearInterval(getRandomResult);

                                var message = '';
                                if(result === parseInt(bet)) {
                                    message = 'You won!';
                                    cash += betAmount;
                                } else {
                                    message = 'You lost :(';
                                    cash -= betAmount;
                                }

                                msgField.innerHTML = message;
                                msgField.classList.remove('hidden');
                                cashField.innerHTML = cash;

                                // update the play count
                                playCount++;
                                // This is how you can trigger midrolls every other play
                                _triggerMidroll(playCount, {
                                    pause: function() {
                                        console.log('Midroll requested');
                                    },
                                    resume: function() {
                                        console.log('Midroll finished');
                                    }
                                });
                            }
                        }, 100);
                    }
                }
            });

            game.classList.remove('gone');
        }

        A.loadAPI(function(instance) {
            console.log('API loaded in the game', instance);
            API = instance;
            var splashData = _getSplashScreen();

            if(splashData.show && splashData.action) {
                var splashScreen = document.getElementById('splash-screen');
                splashScreen.addEventListener('click', splashData.action);
                splashScreen.classList.remove('gone');

                window.setTimeout(function() {
                    splashScreen.classList.add('gone');
                    initDOMGame();
                }, 2000);
            } else {
                initDOMGame();
            }
        });
    })(GameAPI);

} else {
    throw new Error('No game found');
}
