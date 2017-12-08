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
        project: {
            required: true
        }
    },
    computed: {
        shieldslink() {
            return '/badges/' + this.badge + '/projects/' + this.project
        }
    }
}
</script>