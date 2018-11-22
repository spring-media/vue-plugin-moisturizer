<template>
  <div>
    <template v-if="name"><b>{{name}}</b></template>
    <template v-else><i>No Name</i></template>
  </div>
</template>

<script>
  export default {
    name: 'Handlebars',
    props: ['name']
  }
</script>
