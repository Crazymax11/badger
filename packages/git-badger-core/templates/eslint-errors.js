module.exports = function eslintError(value) {
    console.log(value);
    if (Number(value) > 0) {
        return {
            color: 'red',
            subject: 'eslint-errors',
            status: value
        }
    } 
    return {
        color: 'green',
        subject: 'eslint-errors',
        status: 'clean'
    }
}