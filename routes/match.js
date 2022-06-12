module.exports = (matchController, playerController, championController) => {

    const express = require('express')
    const router = express.Router()

    const path = require('path');

    const { createMatch, getMatch, getAllMatchs } = matchController;
    const { getAllPlayers } = playerController;
    const { getAllChampions } = championController;

    router.post("/", function(req, res) {
        let { player1, player2, champion1, champion2, winner } = req.body;

        let { proof } = req.files;
        
        if(!proof) {
            res.status(400).send();
        }

        let datetime = Date.now();

        let filename = datetime + '-' + proof.name ;

        let uploadPath = path.join(__dirname,  '../proofs/', filename);


        proof.mv(uploadPath, function(err) {
            if (err)
              return res.status(500).send(err);
            
            createMatch(player1, player2, champion1, champion2, winner, filename, datetime, (result) => {
                if(result) {
                    res.status(201).redirect('/');
                } else {
                    res.status(500).render('create_match_error');
                }
            });
        });


    });

    router.get("/", function(req, res) {       
        getAllMatchs( (matchs) => {
            if(matchs) {
                getAllPlayers( (players) => {
                    if(players) {
                        getAllChampions( (champions) => {
                            if(champions) {
                                res.status(200).render('matchs', { matchs, champions, players });
                            } else {
                                res.status(500).render('get_all_matchs_error');
                            }
                        })
                    } else {
                        res.status(500).render('get_all_matchs_error');
                    }
                })
                
            } else {
                res.status(500).render('get_all_matchs_error');
            }
        })
    });

    return router;
}