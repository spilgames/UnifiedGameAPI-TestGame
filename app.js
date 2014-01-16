var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendfile( __dirname + '/game.html');
});

app.listen(process.env.VMC_APP_PORT || 1337, null);