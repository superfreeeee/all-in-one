<template>
  <div>inheritAttrs: false</div>
</template>

<script>
export default {
  inheritAttrs: false,

  mounted() {
    console.log('InheritAttrsFalse #mounted: $attrs', this.$attrs);
  },
};
</script>
