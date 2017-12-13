<template>
    <a :href="'/badges/'+badge">
        <img :src="shieldslink">
    </a>
</template>
<script>
export default {
    props: {
        badge: {
            required: true
        },
        status: {
            default: 'none'
        }
    },
    computed: {
        shieldslink() {
            return '/api/badges/' + this.badge + '/status/' + this.status
        }
    }
}
</script>