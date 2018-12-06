## vimers

a package to manage timers with mixin

## Reference

After I contribute for [vue-timers](https://github.com/Kelin2025/vue-timers), I want to write a package which base on es6 class

You`d better to use vue-timers, it will be stable and maintainable

## Installation

```bash
npm install vimers
yarn add vimers
```

## Usage

#### 1. Global import

```js
import vimers from 'vimers'
import Vue from 'vue'

Vue.use(vimers)
```

#### 2. Mixins import in component

```js
import vimers from 'vimers/src/mixin'
import Vue from 'vue'

export default {
  mixins: [vimers],
  timers: {
    log: { time: 1000, autostart: true },
  },
  methods: {
    log() {
      console.log('Hello world')
    },
    startTimer(name) {
      this.$timer.start(name)
      // or use
      // this.timers[name].start()
    },
    stopTimer(name) {
      this.$timer.stop(name)
      // or use
      // this.timers[name].stop()
    },
    restartTimer(name) {
      this.$timer.restart(name)
      // or use
      // this.timers[name].restart()
    },
  },
}
```

#### 3. Listen emitter

```vue
<template>
  <some-component
    @timer-start:log="handleLogStart"
    @timer-stop:log="handleLogStop"
    @timer-restart:log="handleLogRestart"
  >
  </some-component>
</template>
<script>
export default {
  methods: {
    handleLogStart() {
      // do something when log timer start
    },
    handleLogStop() {
      // do something when log timer stop
    },
    handleLogRestart() {
      // do something when log timer restart
    },
  },
}
</script>
```

### Timer object

```js
{
  // Name of timer
  // Default: timer key (with object notation)
  name: String,

  // Tick callback or method name from component
  // Note: callback is binded to component instance
  // Default: name
  callback: Function/String,

  // Autostart timer from created hook
  // Default: false
  autostart: Boolean,

  // Set true to repeat (with setInterval) or false (setTimeout)
  // Default: false
  repeat: Boolean,

  // Set true to call first tick immediate
  // Note: repeat must be true too
  // Default: false
  immediate: Boolean,

  // Time between ticks
  // Default: 1000
  time: Number

  // Switch timer`s status between activated and deactivated
  // Default: false
  isSwitchTab: Boolean
}
```

## Author

[masongzhi](https://github.com/masongzhi)

## License

MIT
