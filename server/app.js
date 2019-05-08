const _ = require("lodash");
const express = require("express");
//jwt token require
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const app = express();

//jwt configure
app.use(bodyParser.json());
app.use(expressJwt({secret: 'todo-app-super-shared-secret'}).unless({path: ['/api/auth']}));

// var WAGERS = [
//   {
//     id: 1,
//     name: "Sky Blue",
//     details: "Is sky blue in color?",
//     stake: false,
//     committed: false,
//     expired: false,
//     won: false,
//     verdict: false
//   },

//   {
//     id: 2,
//     name: "White Milk",
//     details: "Is milk white in color?",
//     stake: false,
//     committed: false,
//     expired: false,
//     won: false,
//     verdict: false
//   }
// ];

var TODOS = [
  { id: 1, user_id: 1, name: "Get Milk", completed: false },
  { id: 2, user_id: 1, name: "Fetch Kids", completed: true },
  { id: 3, user_id: 2, name: "Buy flowers for wife", completed: false },
  { id: 4, user_id: 3, name: "Finish Angular JWT Todo App", completed: false }
];

// var TODOS = [
//     { 'id': 1, 'user_id': 1, 'bet': {id: 1 , name:"Sky blue", bet:true}, result: true,'completed': false , won: true},
//     { 'id': 1, 'user_id': 1, 'bet': {id: 1 , name:"Red Moon", bet:true}, result: true,'completed': false , won: true}
// ];

var USERS = [
  { id: 1, username: "deb" },
  { id: 2, username: "santosh" },
  { id: 3, username: "sameer" }
];
function getTodos(userID) {
  var todos = _.filter(TODOS, ["user_id", userID]);

  return todos;
}
function getTodo(todoID) {
  var todo = _.find(TODOS, function(todo) {
    return todo.id == todoID;
  });

  return todo;
}
function getUsers() {
  return USERS;
}

app.post("/api/auth", function(req, res) {
  const body = req.body;

  const user = USERS.find(user => user.username == body.username);
  if (!user || body.password != "todo") return res.sendStatus(401);

  var token = jwt.sign({ userID: user.id }, "todo-app-super-shared-secret", {
    expiresIn: "2h"
  });
  res.send({ token });
});

app.get("/", function(req, res) {
  res.send("Angular JWT Todo API Server");
});
app.get("/api/todos", function(req, res) {
  res.type("json");
  // res.send(getTodos(1));
  res.send(getTodos(req.user.userID));
});
app.get("/api/todos/:id", function(req, res) {
  var todoID = req.params.id;
  res.type("json");
  res.send(getTodo(todoID));
});
app.get("/api/users", function(req, res) {
  res.type("json");
  res.send(getUsers());
});

//wager
//create a genre
// app.put("/api/wager/create", (req, res) => {
//   const wager = WAGERS.find(c => c.id === parseInt(req.body.id));

//   if (wager)
//     return res.status(404).send("Wager with specific id already present");

//   const { error } = validateWager(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   //fill the object
//   const newWager = {
//     id: WAGERS.length + 1,
//     name: req.body.name,
//     details: req.body.details,
//     stake: req.body.stake?req.body.stake:false,
//     committed: req.body.committed?req.body.committed:false,
//     expired: req.body.expired?req.body.expired:false,
//     won: req.body.won?req.body.won:false,
//     verdict: req.body.verdict?req.body.verdict:false,
//   };

//   WAGERS.push(newWager);
//   return res.send(newWager);
// });

// app.listen(4000, function() {
//   console.log("Angular JWT Todo API Server listening on port 4000!");
// });

// function validateWager(wager) {
//   const schema = {
//     id: Joi.number().positive(),
//     name: Joi.string()
//       .min(3)
//       .required(),
//     details: Joi.string()
//       .min(5)
//       .required()
//   };
//   return Joi.validate(wager, schema);
// }
