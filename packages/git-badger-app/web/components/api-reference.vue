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
                method:  'GET',
                url: '/api/badges/:name/projects/:project ',
                description: 'redirects to https://shields.io svg badge with last badge status for your project'
            },
            {
                method:  'POST',
                url: '/api/badges/:name/projects/:project',
                description: 'with body {status: \'some status\'} creates a new record to your project about current status of badge.'
            },
            {
                method: 'GET',
                url: '/api/badges',
                description: 'returns all available badges'
            },
            {
                method: 'GET',
                url: '/api/badges/:name',
                description: 'returns badge info'
            },
            {
                method: 'GET',
                url: '/api/badges/:name/image',
                description: 'returns badge image'
            },
            {
                method: 'GET',
                url: '/api/badges/:name/status/:status',
                description: 'redirects to https://shields.io to corresponing shield'
            },
            {
                method: 'GET',
                url: '/api/projects/:project/status',
                description: 'returns actual badge statuses for project'
            },
            {
                method: 'GET',
                url: '/api/activities?offset=0&limit=100',
                description: 'return a list of last stored statuses with specified offset and limit'
            },
            {
                method:  'GET',
                url: '/api/status',
                description: 'returns status of application and status of store.'
            },
            {
                method:  'GET',
                url: '/api/status/:badge/:project',
                description: 'returns store status for given badge and project'
            },
            {
                method:  'GET',
                url: '/api/status/:badge',
                description: 'returns store status for given badge'
            },
            {
                method:  'GET',
                url: '/api/status/projects/:project',
                description: 'returns store status for given project'
            }
          ]
      }
  }
}

</script>
