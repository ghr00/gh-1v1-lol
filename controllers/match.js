

module.exports = (connection) => {
    const rate = require('../elo/elo');

    const confirmMatch = (matchId, callback) => {
        getMatch(matchId, (match) => {
            let sql = "SELECT winner, elo FROM GHDawri.Match INNER JOIN GHDawri.Player ON GHDawri.Match.winner = GHDawri.Player.name"
            connection.query(sql, [match.id], function (error, winner, fields) {
                if (error) { callback(false); console.error(error); }
                else {
                    let sql = "SELECT looser, elo FROM GHDawri.Match WHERE GHDawri.Match.id = ? INNER JOIN GHDawri.Player ON GHDawri.Match.looser = GHDawri.Player.name"
                    connection.query(sql, [match.id], function (error, looser, fields) {
                        if (error) { callback(false); console.error(error); }
                        else {
                            let winnerName = winner.name;
                            let looserName = looser.name;

                            let oldWinnerElo = winner.elo;
                            let oldLooserElo = looser.elo;

                            let newWinnerElo = rate(oldWinnerElo, oldLooserElo, true);
                            let newLooserElo = rate(oldWinnerElo, oldLooserElo, false);

                            let sql = "UPDATE GHDawri.Player SET elo = ? WHERE name = ?";
                            connection.query(sql, [newWinnerElo, winnerName], function (error, looser, fields) {
                                let sql = "UPDATE GHDawri.Player SET elo = ? WHERE name = ?";
                                connection.query(sql, [newLooserElo, looserName], function (error, looser, fields) {
                                    if(error) {
                                        console.error(error);
                                    }
                                });
                            });

                        }
                    });
                }
            })
        });
    }

    const createMatch = (champion1, champion2, winnerName, looserName, proof, datetime, callback) => {
        let sql = "INSERT INTO GHDawri.Match(champion1, champion2, winner, looser, proof, date) VALUES ( ?, ?, ?, ?, ?, ? )";
        let data = [ champion1, champion2, winnerName, looserName, proof, datetime ]
        connection.query(sql, data, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            else callback(true);
        })
    }

    const getAllMatchs = (callback) => {
        let sql = "SELECT winner, looser, champion1, champion2, state FROM GHDawri.Match"
        connection.query(sql, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            else callback(results);
        })


    }

    const getMatch = (matchId, callback) => {
        let sql = "SELECT * FROM GHDawri.Match WHERE id = ?";
        let data = [matchId]
        connection.query(sql, data, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            
            else callback(results[0]) 
        })
    }

    return { confirmMatch, createMatch, getAllMatchs, getMatch }
}