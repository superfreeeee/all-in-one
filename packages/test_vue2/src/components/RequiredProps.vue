<template>
  <div>
    <div>attrNumber: {{ `${attrNumber}` }}</div>
    <div>attrString: {{ attrString }}</div>
  </div>
</template>

<script>
export default {
  props: {
    attrNumber: {
      type: Number,
    },
    attrString: {
      type: String,
      required: true,
    },
  },
};
</script>
