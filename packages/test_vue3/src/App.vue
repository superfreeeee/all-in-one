<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue';
// import TheWelcome from './components/TheWelcome.vue';
import TutorialDemo from './pages/tutorial/TutorialDemo.vue';
import ReactiveTest from './pages/reactive/ReactiveTest.vue';
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main> -->

  <!-- ============================== -->

  <!-- <TutorialDemo /> -->

  <ReactiveTest />
</template>

<style scoped>
header {
  display: flex;
  place-items: center;
  padding-right: calc(var(--section-gap) / 2);
  line-height: 1.5;
}

header .wrapper {
  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
}

.logo {
  display: block;
  margin: 0 2rem 0 0;
}
</style>
