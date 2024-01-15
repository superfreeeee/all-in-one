<template>
  <input
    type="text"
    :value="customValue"
    @input="$emit('custom-input', $event.target.value)"
  />
</template>

<script>
export default {
  model: {
    prop: 'custom-value',
    event: 'custom-input',
  },
  props: {
    customValue: String,
  },
};
</script>
