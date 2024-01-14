<template>
  <div
    id="demo-event-handler"
    class="demo block"
  >
    <button @click="emitCreate">Create event</button>
    <button @click="emitDrop">Drop event</button>
  </div>
</template>

<script>
export default {
  methods: {
    emitCreate() {
      this.$emit('create', { id: 1, type: 'CreateEvent' }, 1, 2, 3);
    },
    emitDrop() {
      // $emit(eventName, event)
      this.$emit('drop', { id: 2, type: 'DropEvent' });
    },
  },
};
</script>
