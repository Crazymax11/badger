// value - проценты от 0 до 100
module.exports = function flowCoverage(value) {
    if (value > 100) {
        return {
            color: 'lightgrey',
            subject: 'flow',
            status: 'incorrect data'
        }
    }

    if (value > 80) {
        return {
            color: 'green',
            subject: 'flow',
            status: value + '%'
        }
    }

    if (value > 60) {
        return {
            color: 'yellowgreen',
            subject: 'flow',
            status: value + '%'
        }
    }

    if (value > 40) {
        return {
            color: 'yellow',
            subject: 'flow',
            status: value + '%'
        }
    }


    if (value > 20) {
        return {
            color: 'orange',
            subject: 'flow',
            status: value + '%'
        }
    }

    return {
        color: 'red',
        subject: 'flow',
        status: value + '%'
    }
}