<template>
    <el-card>
        <div slot="header">
            <h3> POST badge form </h3>
            <p> You can test posting data here </p>
        </div>
        <el-form :inline="true">
            <el-form-item label="Status">
                <el-input v-model="status" placeholder="100"/>
            </el-form-item>
            <el-form-item label="Project">
                <el-input v-model="project" placeholder="my-project"/>
            </el-form-item>
            <el-form-item label="Subject">
                <el-input v-model="subject" placeholder="eslint-errors"/>
            </el-form-item>
            <el-button type="success" :loading="loading" @click="post"> POST </el-button>
            <badge-shield :badge="subject" :status="status"/>
        </el-form>
    </el-card>
    
</template>
<script>
export default {
    data() {
        return {
            status: '',
            badge: '',
            subject: '',
            project: '',
            loading: false
        }
    },
    methods: {
        post() {
            this.loading = true;
            fetch(`/badges/${this.subject}/${this.project}`, {
                method: 'post',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({status: String(this.status)})
            })
            .catch((err) => {
                console.error(err);
            })
            .then(() => {
                this.loading = false;
            })
        }
    }
}
</script>