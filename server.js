// server.js

// set up ========================
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var users = [{
  id: 1,
  username: 'admin',
  password: 'a',
  role: 'admin',
  name: 'Admin'
}, {
  id: 2,
  username: 'Director',
  password: '111',
  role: 'director',
  name: 'Director'
}, {
  id: 3,
  username: 'Profe 01',
  password: '222',
  role: 'profesor',
  name: 'Profe 01'
}, {
  id: 4,
  username: 'Profe 02',
  password: '222',
  role: 'profesor',
  name: 'Profe 02'
}, {
  id: 5,
  username: 'Profe 03',
  password: '222',
  role: 'profesor'
}, {
  id: 6,
  username: 'Padre 01',
  password: '333',
  role: 'father',
  name: 'Padre 01'
}, {
  id: 7,
  username: 'Padre 02',
  password: '333',
  role: 'father',
  name: 'Padre 02'
}, {
  id: 8,
  username: 'Padre 03',
  password: '333',
  role: 'father',
  name: 'Padre 03'
}, {
  id: 9,
  username: 'Padre 04',
  password: '333',
  role: 'father',
  name: 'Padre 04'
}, {
  id: 10,
  username: 'Padre 05',
  password: '333',
  role: 'father',
  name: 'Padre 05'
  
}, {
  id: 11,
  username: 'Padre 06',
  password: '333',
  role: 'father'
}];

var isAuthenticated = function(username, password) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password)
      return users[i];
  }
  return null;
}

//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    var authenticate = isAuthenticated(username, password);
    if (authenticate) // TODO: solve "security" password issues
      return done(null, {
      id: parseInt(Math.random() * 1000000000),
      user: {
        id: authenticate.id,
        name: authenticate.name,
        role: authenticate.role
      }
    });

    return done(null, false, {
      message: 'Incorrect username.'
    });
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next) {
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};
//==================================================================

var app = express(); // create our app w/ express

// configuration =================
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  secret: 'keyboard cat'
}));
// Add passport initialization
app.use(passport.initialize());
// Add passport initialization
app.use(passport.session());
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/Client'));

//==========================================
// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});
// route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

// route to log out
app.post('/logout', function(req, res) {
  req.logOut();
  res.send(200);
});

// == USERS ==
app.get('/users', auth, function(req, res) {
  res.send(users);
});

//== Schools

var schools = [];

app.get('/api/schools', auth, function(req, res) {
  res.status(200).send(schools);
});

app.get('/api/schools/:id', auth, function(req, res) {
  var school = getSchoolById(req.params.id);
  if(school){
    res.send(school);
  }else{
    res.status(404).send('Sorry, we cannot find that!');
  }
});

app.post('/api/schools', auth, function(req, res) {
  var school = req.body;
  
  if(isSchool(school)){
    var schoolAdded = addSchool(school);
    res.status(201).send(schoolAdded);
  }else{
    res.status(400).send('Sorry, we cannot save that!');
  }
});

app.put('/api/schools/:id', auth, function(req, res) {
  var id = req.params.id;
  var school = req.body;
  var schoolUpdated = updateSchool(id, school);
  if(schoolUpdated){
    res.status(200).send(schoolUpdated);
  }else{
    res.status(404).send('Sorry, we cannot find that!');
  }
});

app.delete('/api/schools/:id', auth, function(req, res) {
  var id = deleteSchool(req.params.id);
  if(id){
    res.status(200).send(id);
  }else{
    res.status(404).send('Sorry, we cannot find that!');
  }
});

var isSchool = function (school) {
  return school.name != null;
};

var addSchool = function (school) {
  var name = school.name;
  var formatedSchool = {
    id: parseInt( Math.random() * 10100101 , 10) +"",
    name: name,
    director: null,
    teachers: []
  };

  schools.push(formatedSchool);

  return formatedSchool;
};

var updateSchool = function(id, school) {
  for (var i = 0; i < schools.length; i++) {
    if(schools[i].id === id)
      for(var key in schools[i]){
        if(school[key])
          schools[i][key] = school[key];
      }
      return schools[i];
  }
  return null;
};

var deleteSchool = function(id) {
  var index = -1;
  for (var i = 0; i < schools.length; i++) {
    if(schools[i].id === id)
      index = i;
  }
  if(index !== -1){
    schools.splice(index,1);
    return id;
  }

  return null;
};

var getSchoolById = function (id) {
  for (var i = 0; i < schools.length; i++) {
    if(schools[i].id === id)
      return schools[i];
  }
  return null;
};

// listen (start app with node server.js) ======================================
var port = process.env.PORT || 8080;
app.listen(port);
console.log("App listening on port" + port);