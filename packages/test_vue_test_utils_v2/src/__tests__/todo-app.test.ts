import { test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoApp from '../TodoApp.vue';

const TODO_SELECTOR = '[data-test="todo"]';
const TODO_CHECKBOX_SELECTOR = '[data-test="todo-checkbox"]';
const NEW_TODO_INPUT_SELECTOR = '[data-test="new-todo"]';
const NEW_TODO_FORM_SELECTOR = '[data-test="form"]';

test('renders a todo', () => {
  const wrapper = mount(TodoApp);

  const todo = wrapper.get(TODO_SELECTOR);

  expect(todo.text()).toBe('Learn Vue.js 3');
});

test('creates a todo', async () => {
  const wrapper = mount(TodoApp);
  expect(wrapper.findAll(TODO_SELECTOR)).toHaveLength(1);

  await wrapper.get(NEW_TODO_INPUT_SELECTOR).setValue('New todo');
  await wrapper.get(NEW_TODO_FORM_SELECTOR).trigger('submit');

  expect(wrapper.findAll(TODO_SELECTOR)).toHaveLength(2);
});

test('completes a todo', async () => {
  const wrapper = mount(TodoApp);

  await wrapper.get(TODO_CHECKBOX_SELECTOR).setValue(true);

  expect(wrapper.get(TODO_SELECTOR).classes()).toContain('completed');
});
