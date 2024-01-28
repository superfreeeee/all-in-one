<template>
  <div>
    <div>{{ dataRaw }}</div>
    <div>{{ data }}</div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const dataRaw = inject('dataRaw');

const data = inject('data');
</script>
