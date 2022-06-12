module.exports = (playerController) => {

    const express = require('express')
    const router = express.Router()

    const { createPlayer, getAllPlayers, getPlayer, checkUser, signIn } = playerController;

    router.get("/signin", function(req, res) {
        let { name, password } = req.query;

        if(name && password) {
            checkUser(name, password, (result) => {
                if(result) {
                    signIn(name, function(err, token) {
                        if(err) { console.error(err); res.status(500).render('sign_in_result', { result : false }); }
                        else {
                            res.cookie('token',  token, { httpOnly : true, });
                            res.status(200).render('sign_in_result', { result : true });
                        }
                    });
                } else {
                    res.status(401).render('sign_in_result', { result : false });
                }
            })
        } else {
            res.status(400).render('sign_in_result', { result : false });
        }
    });

    router.get("/", function (req, res) {
        let { id, name } = req.query;
        console.log(id, name)
        if(!id && !name) {
            getAllPlayers( (players) => {
                res.json(players);
            });
        } else {
            getPlayer(id, name, (player) => {
                res.json(player);
            });
        }
    });

    router.post("/", function(req, res) {
        console.log(req.body)
        let { name, password, confirmedPassword, email, city, country, opgg } = req.body;

        if(password === confirmedPassword) {
            console.log("OK")

            createPlayer(name, password, email, city, country, opgg, (result) => {
                if(result) {
                    res.status(201).render('sign_up_result', { result : true });
                } else {
                    res.status(500).render('sign_up_result', { result : false });
                }
            });
        } else {
            res.status(400).render('sign_up_result', { result : false });
        }
    });

    router.get("/profile", function(req, res) {
        let { name } = req.auth;

        if(name) {
            getPlayer(null, name, (result) => {
                if(result) {
                    res.status(200).render('profile', result)
                } else {
                    res.status(404).send();
                }
            })
        } else {
            res.status(404).send();
        }
    })

    return router;
}