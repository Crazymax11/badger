<template>
    <a :href="link" target="blank">
        <img v-if="image" :src="image" width="16" height="16">
        <span> {{name}} </span>
    </a>
</template>
<script>
export default {
    props: { 
        name: {
            required: true
        }
    },
    computed: {
        link() {
            return '/badges/' + this.name;
        }
    },
    data() {
        return {
            image: ''
        }
    },
    watch: {
        name(newName) {
            fetch('/badges/' + newName + '/image')
                .then(res => res.text())
                .then(image => this.image = image);
        }
    },
    mounted() {
        fetch('/badges/' + this.name + '/image')
                .then(res => res.text())
                .then(image => this.image = image);
    }
}
</script>