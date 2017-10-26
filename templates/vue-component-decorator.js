module.exports = function vueComponentDecorator(value) {
    if (value > 100) {
        return {
            color: 'red',
            subject: 'vue-component',
            status: value
        }
    }
    if (value > 0) {
        return {
            color: 'yellow',
            subject: 'vue-component',
            status: value
        }
    } 

    return {
        color: 'green',
        subject: 'vue-component',
        status: 'clean'
    }
}