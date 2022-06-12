let elo = (K) => {
    let get_E = (Ra, Rb) => {
        let val = Math.pow(10, (Rb-Ra)/400);

        return 1 / (1 + val);
    }

    let rate = (Ra, Rb, winnerIsPlayerA) => {
        let Sa = winnerIsPlayerA === true ? 1 : 0;

        return Ra + K * (Sa - get_E(Ra, Rb));
    }

    return rate;
}

module.exports = elo(400)