var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080;


app.use(express.static('frontend/dist'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection',function(socket){
  console.log('connected');
//  socket.on('message',function(msg){
//    console.log('message:'+msg);
//  });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
