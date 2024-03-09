<template>
  <div>
    <div
      v-for="todo in todos"
      data-test="todo"
      :key="todo.id"
      :class="[todo.completed ? 'completed' : '']"
    >
      {{ todo.text }}
      <input
        type="checkbox"
        v-model="todo.completed"
        data-test="todo-checkbox"
      />
    </div>

    <form
      data-test="form"
      @submit.prevent="createTodo"
    >
      <input
        data-test="new-todo"
        v-model="newTodo"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const todos = ref([
  {
    id: 1,
    text: 'Learn Vue.js 3',
    completed: false,
  },
]);

const newTodo = ref('');

const createTodo = () => {
  todos.value.push({
    id: 2,
    text: newTodo.value,
    completed: false,
  });
};
</script>
