<template>
  <div
    id="demo-list-render"
    class="demo"
  >
    <h2>Demo: List Render = v-for</h2>

    <h3>列表渲染: for-in array</h3>
    <div>
      <div
        v-for="item in items"
        :key="item.message"
      >
        {{ item.message }}
      </div>
    </div>

    <h3>列表渲染: for-in array + index</h3>
    <div>
      <div
        v-for="(item, index) in items"
        :key="item.message"
      >
        {{ `${index}. ${item.message}` }}
      </div>
    </div>

    <h3>列表渲染: for-of array</h3>
    <div>
      <div
        v-for="item of items"
        :key="item.message"
      >
        {{ item.message }}
      </div>
    </div>

    <h3>列表渲染: for-of array + index</h3>
    <div>
      <div
        v-for="(item, index) of items"
        :key="item.message"
      >
        {{ `${index}. ${item.message}` }}
      </div>
    </div>

    <h3>列表渲染: for-in object</h3>
    <div>
      <div
        v-for="value in object"
        :key="value"
      >
        {{ value }}
      </div>
    </div>

    <h3>列表渲染: for-in object + key</h3>
    <div>
      <div
        v-for="(value, key) in object"
        :key="key"
      >
        {{ `${key}: ${value}` }}
      </div>
    </div>

    <h3>列表渲染: for-of object + key + index</h3>
    <div>
      <div
        v-for="(value, key, index) of object"
        :key="key"
      >
        {{ `${index}. ${key}: ${value}` }}
      </div>
    </div>

    <h3>列表渲染: for-of range</h3>
    <div>
      <div
        v-for="(value, index) in 10"
        :key="value"
      >
        {{ `${index}: ${value}` }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoListRender',
  data() {
    return {
      items: [
        { message: 'Foo' },
        { message: 'Woo' },
        { message: 'Bar' },
        { message: 'Car' },
      ],
      object: {
        title: 'How to do lists in Vue',
        author: 'Jane Doe',
        publishedAt: '2016-04-10',
      },
    };
  },
  methods: {},
};
</script>
