<template>
    <el-card>
        <div slot="header"> <h4> Available API </h4> </div>
        <el-table :data="tableData">
            <el-table-column label="Method" prop="method"/>
            <el-table-column label="Url" prop="url"/>
            <el-table-column label="Description" prop="description"/>
        </el-table>
    </el-card>
</template>
<script>
export default {
  data() {
      return {
          tableData: [
            {
                method:  'POST',
                url: '/badges/:badge/:project',
                description: 'with body {status: \'some status\'} creates a new record to your project about current status of badge.'
            },
            {
                method:  'GET',
                url: '/badges/:badge/:project ',
                description: 'redirects to https://shields.io svg badge with last badge status for your project'
            },
            {
                method:  'GET',
                url: '/badges/:project',
                description: 'shows all badges for project'
            },
            {
                method:  'GET',
                url: '/badges/:badge/history/:project',
                description: 'shows badge history for project'
            },
            {
                method:  'GET',
                url: '/status',
                description: 'returns status of application and status of store.'
            },
            {
                method:  'GET',
                url: '/status/:badge/:project',
                description: 'returns store status for given badge and project'
            },
            {
                method:  'GET',
                url: '/status/:badge',
                description: 'returns store status for given badge'
            },
            {
                method:  'GET',
                url: '/status/projects/:project',
                description: 'returns store status for given project'
            }
          ]
      }
  }
}
</script>
