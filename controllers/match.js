

module.exports = (connection) => {
    const jwt = require('jsonwebtoken');

    const createMatch = (playerName1, playerName2, champion1, champion2, winnerName, proof, datetime, callback) => {
        let sql = "INSERT INTO GHDawri.Match(player1, player2, champion1, champion2, winner, proof, date) VALUES ( ?, ?, ?, ?, ?, ?, ? )";
        let data = [ playerName1, playerName2, champion1, champion2, winnerName, proof, datetime ]
        connection.query(sql, data, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            else callback(true);
        })
    }

    const getAllMatchs = (callback) => {
        let sql = "SELECT player1, player2, champion1, champion2, winner, state FROM GHDawri.Match"
        connection.query(sql, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            else callback(results);
        })


    }

    const getMatch = (id, name, callback) => {
        let sql;
        let data;

        if(id && !name) {
            sql = "SELECT * FROM GHDawri.Match WHERE id = ?";
            data = [ id ]
        } else if(!id && name) {
            sql = "SELECT * FROM GHDawri.Match WHERE name = ?";
            data = [ name ]
        } else if( id && name ) {
            sql = "SELECT * FROM GHDawri.Match WHERE id = ? and name = ?";
            data = [ id, name ]
        } else {
            throw new Error("getPlayer params are NULL");
        }

        connection.query(sql, data, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            
            else callback(results[0]) 
        })
    }

    return { createMatch, getAllMatchs, getMatch }
}