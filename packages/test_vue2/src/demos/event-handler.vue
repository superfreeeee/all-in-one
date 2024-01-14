<template>
  <div
    id="demo-event-handler"
    class="demo"
  >
    <h2>Demo: Event Handler</h2>

    <h3>绑定原生事件: 方法</h3>
    <div class="block">
      <button @click="onBtnClick">onBtnClick</button>
      <input
        @change="onInputChange"
        @input="onInputInput"
      />
    </div>

    <h3>绑定原生事件: 表达式</h3>
    <div>
      <div>也可以直接绑定表达式, $event 表示事件变量</div>
      <button @click="log('onBtnClick2', $event)">onBtnClick</button>
    </div>

    <h3>修饰符</h3>
    <div>
      <div>
        只触发一次:
        <button @click.once="log('onBtnClick3 once', $event)">
          onBtnClick once
        </button>
      </div>
      <div>
        按键修饰符 shift + click 才触发:
        <button @click.shift.exact="log('onBtnClick3 shift + exact', $event)">
          onBtnClick shift + exact
        </button>
      </div>
    </div>

    <h3>自定义事件</h3>
    <div>
      <div>使用 this.$emit 触发自定义事件</div>
      <div>create 事件: 使用自定义方法可以接到所有参数</div>
      <div>drop 事件: $event 默认为事件名后第一个参数</div>
      <CustomComponentEvent
        @create="handleCustomEvent"
        @drop="log($event)"
      />
    </div>
  </div>
</template>

<script>
import CustomComponentEvent from '../components/CustomComponentEvent.vue';

export default {
  name: 'DemoEventHandler',
  components: {
    CustomComponentEvent,
  },
  data() {
    return {};
  },
  methods: {
    onBtnClick(e) {
      console.log('onBtnClick', e);
    },
    onInputChange(e) {
      console.log('onInputChange', e, {
        value: e.target.value,
      });
    },
    onInputInput(e) {
      console.log('onInputInput', e, {
        inputType: e.inputType,
        value: e.target.value,
      });
    },
    log(...props) {
      console.log(...props);
    },
    handleCustomEvent(...props) {
      console.log('handleCustomEvent', props);
    },
  },
};
</script>
