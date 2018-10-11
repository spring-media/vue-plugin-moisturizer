<template>
  <a @click="handleClick">A</a>
</template>

<script>
module.exports = {
  name: "A",
  methods: {
    handleClick() {
      window.spy("A");
    }
  }
};
</script>

