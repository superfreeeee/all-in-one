<template>
  <div
    id="demo-conditional-render"
    class="demo"
  >
    <h2>Demo: Conditional Render</h2>

    <h3>条件渲染: v-if</h3>
    <div>
      <div>currentTab: {{ currentTab }}</div>
      <button @click="nextTab">nextTab</button>
      <button @click="incementTab">incementTab</button>

      <div>切换 tab 会切换渲染 div</div>
      <div>不输入下切换 tab 可看到 placeholder 变化</div>
      <div>el 可能复用, 使用 key 标识, 切换到 unknown 可看到输入内容清空</div>

      <div v-if="currentTab === 0">
        This is tab 0
        <input placeholder="This is tab 0" />
      </div>
      <div v-else-if="currentTab === 1">
        This is tab 1
        <input placeholder="This is tab 1" />
      </div>
      <div v-else-if="currentTab === 2">
        This is tab 2
        <input placeholder="This is tab 2" />
      </div>
      <div v-else>
        This is tab unknown
        <input
          placeholder="This is tab unknown"
          key="unknwon"
        />
      </div>
    </div>

    <h3>条件渲染: v-show</h3>
    <div>
      <button @click="visible = !visible">visible: {{ visible }}</button>
      <div v-show="visible">1. visible === true</div>
      <div
        v-show="visible"
        :style="visibleStyle"
      >
        2. visible === true
      </div>
      <div v-show="!visible">3. visible === false</div>
      <div v-show="!visible">4. 垫一下位子</div>
      <div>v-show 强制 toggle display: none;</div>
      <div>上面第二个 div 证明了就算使用 bind style 也无效</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoConditionalRender',
  data() {
    return {
      currentTab: 0,
      visible: true,
      visibleStyle: {
        display: 'block',
      },
    };
  },
  methods: {
    nextTab() {
      this.currentTab = (this.currentTab + 1) % 3;
    },
    incementTab() {
      this.currentTab += 3;
    },
  },
};
</script>
