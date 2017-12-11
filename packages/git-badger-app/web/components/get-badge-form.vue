<template>
    <el-card>
        <div slot="header">
            <h3> GET badge form </h3>
            <p> You can get project badges here </p>
        </div>
        <el-form :inline="true">
            <el-form-item label="Project">
                <el-input v-model="project" placeholder="my-project"/>
            </el-form-item>
            <el-form-item label="Subject">
                <el-input v-model="subject" placeholder="eslint-errors"/>
            </el-form-item>
            <project-shield :badge="subject" :project="project"/>
        </el-form>
    </el-card>
    
</template>
<script>
export default {
    data() {
        return {
            subject: '',
            project: ''
        }
    }
}
</script>