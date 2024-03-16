import styles from './App.module.css';
import { SignalsDemo } from './demos/Signals';
import { EffectsDemo } from './demos/Effects';
import { ComponentsDemo } from './demos/Components';
import { EventHandler } from './demos/EventHandler';

function App() {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <SignalsDemo />
        <EffectsDemo />
        <ComponentsDemo />
        <EventHandler />
      </header>
    </div>
  );
}

export default App;
