module.exports = function eslintWarning(value) {
    if (value > 0) {
        return {
            color: 'yellow',
            subject: 'eslint-warnings',
            status: value
        }
    } 
    return {
        color: 'green',
        subject: 'eslint-warnings',
        status: 'clean'
    }
}