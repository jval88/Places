const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "J V",
    email: "test@email.com",
    loggedIn: false,
    password: "test",
  },
  {
    id: "u2",
    name: "C M",
    email: "test2@test.com",
    loggedIn: false,
    password: "password",
  },
];

const getUsers = (req, res, next) => {
  if (!DUMMY_USERS || DUMMY_USERS.length === 0) {
    return next(new HttpError("Could not find any users.", 404));
  }
  res.json({ users: DUMMY_USERS });
};

const createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;
  const userIndex = DUMMY_USERS.findIndex(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  if (userIndex !== -1) {
    return next(new HttpError("User with this email already exists.", 400));
  }
  const newUser = {
    id: uuidv4(),
    name,
    email,
    loggedIn: false,
    password,
  };
  DUMMY_USERS.push(newUser);
  res.status(201).json({ place: newUser });
};

const logIn = (req, res, next) => {
  const { email: userEmail, password } = req.body;
  const foundUser = {
    ...DUMMY_USERS.find((user) => {
      return user.email.toLowerCase() === userEmail.toLowerCase();
    }),
  };
  const userIndex = DUMMY_USERS.findIndex((user) => {
    return user.email.toLowerCase() === userEmail.toLowerCase();
  });
  if (userIndex === -1) {
    return next(new HttpError("Could not find a user with this email.", 401));
  }
  if (foundUser.password !== password) {
    return next(new HttpError("Invalid password email combination.", 401));
  }

  foundUser.loggedIn = true;
  DUMMY_USERS[userIndex] = foundUser;

  res.status(200).json({ user: foundUser });
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.logIn = logIn;
