<template>
    <div>
        <h1> Available badges </h1>
        <ul>
            <li :key="index" v-for="(badge, index) in badges">
                <el-card>
                    <div slot="header" class="card-header">
                        <div class="card-header__title">
                            <img v-if="badge.image" :src="badge.image" width="16" height="16">
                            <h3> {{badge.name}} </h3>
                        </div>
                        <el-button @click="navigate(badge.name)">
                            Try it out
                        </el-button>
                    </div>
                    <div>
                        <el-row>
                            <el-col :span="12">
                                <p> {{badge.description}} </p>
                            </el-col>
                            <el-col :span="12">
                                <ul>
                                    <li :key="badge.name + example" v-for="example in badge.examples">
                                        <badge-shield :badge="badge.name" :status="example"/>
                                    </li>
                                </ul>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
            badges: []
        }
    },
    mounted() {
        fetch('/api/badges')
            .then(res => res.json())
            .then(badges => this.badges = Object.values(badges));
    },
    methods: {
        navigate(badge) {
            window.location = '/badges/' + badge;
        }
    }
}
</script>
<style>
.card-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.card-header__title {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.card-header__title > h3 {
    margin-left: 3px;
}

li {
    list-style: none;
}
</style>