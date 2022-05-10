<template>
  <div>
    <h2 v-if="error.statusCode===404">error Route {{error.statusCode}}</h2>
    <h2 v-else>error ...</h2>
  </div>
</template>
<script>
export default {
  props: ['error'],
  layout: 'error-layout',// use custom layout
  mounted() {
    console.log(this.error)
  }
}
</script>
