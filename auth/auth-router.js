const router = require("express").Router();
const bcrypt = require('bcryptjs');

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
    let user = req.body; // username, password

    const rounds = process.env.HASH_ROUNDS || 8;

    const hash = bcrypt.hashSync(user.password, rounds);

    user.password = hash;

    Users.add(user)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "cannot register user", err });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body; 

    Users.findBy({ username }).then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)) {
            req.session.loggedIn = true;
            res.status(200).json({ message: "Welcome!" });
        } else {
            res.status(401).json({ message: "you cannot enter here!" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "cannot login user", err });
    });
});

module.exports = router;