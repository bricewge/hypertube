<template>
<div id="app">
  <div v-if="$auth.ready()">
    <v-app dark>
      <page-header/>
      <br>
      <main>
        <v-container fluid>
          <router-view/>
        </v-container>
      </main>
  </v-app>
  </div>
  <div v-if="!$auth.ready()">
    <p>Loading ...</p>
  </div>
</div>
</template>

<script>
import PageHeader from '@/components/Header.vue'

export default {
  name: 'app',
  components: {
    PageHeader
  }
}
</script>

<style lang='scss'>
@import '/assets/css/application.scss';
</style>
