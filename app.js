/**
 * Created by Administrator on 15-7-13.
 */
var app = require('express')();
var middlewares = require('express-middlewares-js');
var Router=require('./routes/router');

app.use('/wechat', middlewares.xmlBodyParser({
    type: 'text/xml'
}));

// you can also work with other restful routes
app.use('/api', middlewares.bodyParser());

//
Router(app);
//
app.set('port', process.env.PORT || 80);
//
app.listen(app.get('port'));

console.log('Server listening on port ' + app.get('port'));