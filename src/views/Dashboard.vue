<template>
    <div class="dashboard">
        <h1> Hi, {{userProfile.name}} </h1>
        <GameForm/>
    </div>
</template>

<script>

import {mapState} from 'vuex'
import GameForm from '@/components/GameForm'
export default {
    components: {
        GameForm
    },
    data(){
        return {

        }
    },
    computed: {
        ...mapState(['userProfile'])
    }
}
</script>