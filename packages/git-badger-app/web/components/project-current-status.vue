<template>
    <div>
        <el-button type="primary" icon="el-icon-document" @click="copyMDall"> MD ALL </el-button>
        <el-button type="primary" icon="el-icon-document" @click="copyHTMLall"> HTML ALL </el-button>
        <ul>
            <li :key="record.subject" v-for="(record, index) in records">
                <project-shield :project="record.project" :badge="record.subject"/>
                <el-button type="primary" icon="el-icon-document" @click="copyMD(index)"> MD </el-button>
                <el-button type="primary" icon="el-icon-document" @click="copyHTML(index)"> HTML </el-button>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        project: {
            required: true
        }
    },
    data() {
        return {records: []}
    },
    mounted() {
        
            fetch('/api/projects/' + this.project + '/status')
                .then(res => res.json())
                .then(records => this.records = records);
        
    },
    watch: {
        project(project) {
            fetch('/api/projects/' + project + '/status')
                .then(res => res.json())
                .then(records => this.records = records);
        }
    },
    methods: {
        copyMD(index) {
            this.$copyText(`![${this.records[index].subject}](${window.location.protocol}//${window.location.hostname}/badges/${this.records[index].subject}/projects/${this.records[index].project})`)
        },
        copyHTML(index) {
            this.$copyText(`<a target="_blank" href="${window.location.protocol}//${window.location.hostname}/badges/${this.records[index].subject}"><img src="${window.location.protocol}//${window.location.hostname}/badges/${this.records[index].subject}/projects/${this.records[index].project}"></a>`);
        },
        copyMDall() {
            this.$copyText(this.records.map(record => `![${record.subject}](${window.location.protocol}//${window.location.hostname}/badges/${record.subject}/projects/${record.project})`).join('\n'));
        },
        copyHTMLall(index) {
            this.$copyText(this.records.map(record => `<a target="_blank" href="${window.location.protocol}//${window.location.hostname}/badges/${record.subject}"><img src="${window.location.protocol}//${window.location.hostname}/badges/${record.subject}/projects/${record.project}"></a>`));
        }
    }
}
</script>