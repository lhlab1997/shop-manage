<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  mounted() {
    let that = this
    window.addEventListener('unload',that.saveState)
  },
  methods: {
    saveState() {
      window.sessionStorage.setItem('state',JSON.stringify(this.$store.state))
    }
  }
}
</script>

<style>

</style>
