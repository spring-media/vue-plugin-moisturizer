<template>
  <a @click="handleClick">B</a>
</template>

<script>
module.exports = {
  name: "B",
  methods: {
    handleClick() {
      window.spy("B");
    }
  }
};
</script>

