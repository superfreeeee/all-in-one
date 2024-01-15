<template>
  <div
    id="demo-component-props"
    class="demo"
  >
    <h2>Demo: Component Props</h2>

    <h3>Props 基础</h3>
    <div>
      <input
        type="text"
        v-model="username"
      />
      <button @click="data.currentTime = new Date().toLocaleString()">
        Update currentTime
      </button>

      <!-- display component -->
      <UserProfile
        :username="username"
        :age="24"
        :isGraduated="false"
        :data="data"
      />
    </div>
    <!-- 两种风格的 props 都可以 -->
    <!-- :is-graduated="true" -->

    <h3>非 props 属性继承</h3>
    <div>
      <InheritAttrs :data-test-id="'test-inherit-attrs'" />
      <div>* 非 props 定义属性会被挂载到原生节点上</div>
      <InheritAttrsFalse :data-test-id="'test-inherit-attrs'" />
      <div>* inheritAttrs: false 取消默认行为</div>
      <div>* 使用 $attrs 访问所有传递属性</div>
    </div>
  </div>
</template>

<script>
import InheritAttrs from '../components/InheritAttrs.vue';
import InheritAttrsFalse from '../components/InheritAttrsFalse.vue';
import UserProfile from '../components/UserProfile.vue';

export default {
  components: {
    UserProfile,
    InheritAttrs,
    InheritAttrsFalse,
  },
  name: 'DemoComponentProps',
  data() {
    return {
      username: 'superfree',
      data: {
        currentTime: new Date().toLocaleString(),
      },
    };
  },
  methods: {},
};
</script>
