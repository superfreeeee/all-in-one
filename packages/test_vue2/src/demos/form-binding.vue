<template>
  <div
    id="demo-form-binding"
    class="demo"
  >
    <h2>Demo: Form Binding</h2>

    <!-- input -->
    <h3>表单绑定: input 单行输入</h3>
    <div>
      <input
        type="text"
        placeholder="input placeholder..."
        v-model="input"
      />
      <div>input: {{ `"${input}"` }}</div>
      <button @click="onInputEnd">点击查看 console</button>
    </div>

    <!-- textarea -->
    <h3>表单绑定: textarea 多行输入</h3>
    <div>
      <textarea
        placeholder="textarea placeholder..."
        v-model="textArea"
      />
      <div>textArea: {{ `"${textArea}"` }}</div>
      <button @click="setInput">textArea 内容同步到 input</button>
    </div>

    <!-- single checkbox -->
    <h3>表单绑定: radio 单选 (single checkbox)</h3>
    <div>
      <input
        id="radio"
        type="checkbox"
        v-model="checked"
      />
      <label for="radio">checked: {{ checked }}</label>
      <!-- 这个 for 真的会跟 id="jack" 联动，非常恐怖 -->
      <!-- <label for="jack">checked: {{ checked }}</label> -->
    </div>

    <!-- checkbox -->
    <h3>表单绑定: checkbox 多选</h3>
    <div>
      <input
        id="jack"
        type="checkbox"
        value="Jack"
        v-model="checkedNames"
      />
      <label for="jack">Jack</label>
      <input
        id="john"
        type="checkbox"
        value="John"
        v-model="checkedNames"
      />
      <label for="john">John</label>
      <input
        id="mike"
        type="checkbox"
        value="Mike"
        v-model="checkedNames"
      />
      <label for="mike">Mike</label>

      <div>checkedNames: {{ checkedNames }}</div>
      <div>unknwon 值会一直保留</div>
    </div>

    <!-- radio -->
    <h3>表单绑定: radio 单选</h3>
    <div>
      <input
        id="one"
        type="radio"
        value="One"
        v-model="picked"
      />
      <label for="one">One</label>
      <input
        id="two"
        type="radio"
        value="Two"
        v-model="picked"
      />
      <label for="two">Two</label>

      <div>picked: {{ picked }}</div>
    </div>

    <!-- select -->
    <h3>表单绑定: select 选择框</h3>
    <div>
      <button @click="selectedData.multiple = !selectedData.multiple">
        Toggle multiple: {{ selectedData.multiple }}
      </button>
      <select
        :multiple="selectedData.multiple"
        v-model="selectedData.value"
      >
        <option
          :disabled="selectedData.multiple"
          value=""
        >
          请选择
        </option>
        <option>A</option>
        <option>B</option>
        <option value="value C">C</option>
      </select>
      <span> Selected: {{ selectedData.value }}</span>
    </div>

    <!-- input -->
    <h3>v-model修饰符</h3>
    <div>
      <input
        type="text"
        placeholder="input placeholder..."
        v-model.trim="inputTrimmed"
      />
      <div>inputTrimmed: {{ `"${inputTrimmed}"` }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoFormBinding',
  data() {
    return {
      input: '',
      textArea: '',
      checked: false,
      checkedNames: ['unknown', 'John'],
      picked: 'One',
      selectedData: {
        value: '',
        multiple: false,
      },
      inputTrimmed: '',
    };
  },
  methods: {
    setInput() {
      this.input = this.textArea;
    },
    onInputEnd() {
      console.log('onInputEnd', { input: this.input });
    },
    toggleMultiple() {
      /**
       * TODO 联动逻辑存在警告
       */
      if (this.selectedData.multiple) {
        this.selectedData = {
          value: this.selectedData.value[0] || '',
          multiple: false,
        };
      } else {
        this.selectedData = {
          value: this.selectedData.value ? [this.selectedData.value] : [],
          multiple: true,
        };
      }
    },
  },
};
</script>
