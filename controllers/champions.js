

module.exports = (connection) => {

    const getAllChampions = (callback) => {
        let sql = "SELECT * FROM GHDawri.Champion";
        connection.query(sql, function (error, results, fields) {
            if (error) { callback(false); console.error(error); }
            else callback(results);
        })
    }

    return { getAllChampions }
}