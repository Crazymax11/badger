<template>
    <el-form :inline="true">
        <el-form-item label="Status">
            <el-input v-model="status" placeholder="100"/>
        </el-form-item>
        <badge-shield :badge="badge" :status="status"/>
        <el-button type="primary" icon="el-icon-document" @click="copyMD"> MD </el-button>
        <el-button type="primary" icon="el-icon-document" @click="copyHTML"> HTML </el-button>
    </el-form>
</template>
<script>
export default {
    props: {
        badge: {
            required: true
        }
    },
    data() {
        return {
            status: ''
        }
    },
    methods: {
        copyMD() {
            this.$copyText(`![${this.badge}](${window.location.protocol}//${window.location.hostname}/badge/${this.badge}/status/${this.status})`)
        },
        copyHTML() {
            this.$copyText(`<a target="_blank" href="${window.location.protocol}//${window.location.hostname}/badge/${this.badge}"><img src="${window.location.protocol}//${window.location.hostname}/badge/${this.badge}/status/${this.status}"></a>`);
        }
    }
}
</script>