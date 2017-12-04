<template>
    <el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                label="Badge"
                width="180">
                <template slot-scope="scope">
                    <simple-badge :name="scope.row.subject"/>
                </template>
            </el-table-column>
            <el-table-column
                label="Project"
                width="180">
                <template slot-scope="scope">
                    <a :href="'/projects/' + scope.row.project" target="_blank">
                        <span> {{scope.row.project}} </span>
                    </a>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="Status">
            </el-table-column>
            <el-table-column
                label="Shield">
                <template slot-scope="scope">
                    <badge-shield :badge="scope.row.subject" :status="scope.row.status">
                    </badge-shield>
                </template>
            </el-table-column>
            <el-table-column
                prop="time"
                label="Time">
            </el-table-column>
        </el-table>
        
        <el-pagination
            layout="prev, pager, next"
            size="10"
            :total="recordsCount"
            @current-change="changeOffset">
        </el-pagination>
    </el-row>
</template>
<style>
</style>
<script>
export default {
    data(){ 
        return {
            tableData: [],
            recordsCount: 1,
            offset: 0
        }
    },
    mounted() {
        fetch('/activities/?offset=0&limit=10')
            .then(res => res.json())
            .then(records => {
                records.forEach(record => record.time = (new Date(record.time).toLocaleString()));
                return records;
            })
            .then(records => this.tableData = records)
        fetch('/status')
            .then(res => res.json())
            .then(res => res.records)
            .then(records => {
                this.recordsCount = records;
            })
    },
    methods: {
        changeOffset(page) {
            this.offset = page * 10 - 10;
            fetch(`/activities?offset=${this.offset}&limit=10`)
                .then(res => res.json())
                .then(records => {
                    records.forEach(record => record.time = (new Date(record.time).toLocaleString()));
                    return records;
                })
                .then(records => this.tableData = records)
        }
    }
}
</script>