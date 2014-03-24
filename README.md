#Fake Roulette - HTML5 Test Game#

An awesome fake roulette game built with canvas to test the GameAPI integration.
Feel free to use!

##Installation##

    git clone git@github.com:spilgames/UnifiedGameAPI-TestGame.git
    cd UnifiedGameAPI-TestGame/
    npm install

##Run the game##

    npm start

Then point your web browser to: 
 - [http://localhost:8282/](http://localhost:8282/) for the canvas version
 - [http://localhost:8282/dom](http://localhost:8282/dom) for the DOM version

##Build##

Creates a build of the test game and a new tag ready to push to Github. __ALWAYS__ do this on the master branch!

    grunt build

Options:
 - `grunt build:patch` (goes from 0.0.1 to 0.0.2)
 - `grunt build:minor` (goes from 0.0.1 to 0.1.0)
 - `grunt build:major` (goes from 0.0.1 to 1.0.0)

##Push##

Pushes your latest build to Github

    grunt push

##Deploy##

In order to deploy the Test Game, you will first need to install the AppFog rubygem

    gem install af

Then, to deploy, type the following at the root of the Test Game repo:

    grunt deploy:myAppName:myAfLogin:myAfPassword

Where:
 - 'myAppName': fakeroulette
 - 'myAfLogin' & 'myAfPassword': see e-mail sent to you

###License###

&copy; 2014 SpilGames