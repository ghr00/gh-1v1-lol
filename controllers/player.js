

module.exports = (connection) => {
    const jwt = require('jsonwebtoken');

    const setDivision = (player) => {
        if(player.elo < 1300)
            player.division = "Aliminium I"
        else if(player.elo < 1400)
            player.division = "Iron I"
        else if(player.elo < 1500)
            player.division = "Zinc I"
        else if(player.elo < 1600)
            player.division = "Bronze I"
        else if(player.elo < 1700)
            player.division = "Silver I"
        else if(player.elo < 1800)
            player.division = "Gold I"
        else if(player.elo < 1900)
            player.division = "Platinium I"
        else if(player.elo < 2000)
            player.division = "Diamond I"
        else
            player.division = "Unranked"
        return player;
    }

    const createPlayer = (name, password, email, city, country, opgg, callback) => {
        let sql = "INSERT INTO GHDawri.Player(name, password, email, city, country, opgg) VALUES (?, ?, ?, ?, ?, ?)";
        let data = [ name, password, email, city, country, opgg, callback ]
        connection.query(sql, data, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            
            callback(true);
        })
    }

    const getAllPlayers = (callback) => {
        let sql = "SELECT name, email, elo, city, country, opgg FROM GHDawri.Player";
        connection.query(sql, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            
            results.map( (player) => setDivision(player) );
            
            callback(results);
        })
    }

    const getPlayer = (id, name, callback) => {
        let sql;
        let data;

        if(id && !name) {
            sql = "SELECT name, email, elo, city, country, opgg FROM GHDawri.Player WHERE id = ?";
            data = [ id ]
        } else if(!id && name) {
            sql = "SELECT name, email, elo, city, country, opgg FROM GHDawri.Player WHERE name = ?";
            data = [ name ]
        } else if( id && name ) {
            sql = "SELECT name, email, elo, city, country, opgg FROM GHDawri.Player WHERE id = ? and name = ?";
            data = [ id, name ]
        } else {
            throw new Error("getPlayer params are NULL");
        }

        connection.query(sql, data, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            
            callback(results[0]) 
        })
    }

    const checkUser = (name, password, callback) => {
        let sql = "SELECT EXISTS(SELECT name, password FROM Player WHERE name = ? and password = ?)";
        let data = [ name, password ]
        connection.query(sql, data, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            else {
                console.log(results)
                console.log(fields)
                let r = results[0];
                let result = r[Object.keys(r)[0]];

                console.log(result);

                callback(result === 1) 
            }
        })
    }

    const signIn = (name, callback) => {
        jwt.sign({ name }, process.env.SECRET, callback);
    }

    return { createPlayer, getAllPlayers, getPlayer, checkUser, signIn }
}