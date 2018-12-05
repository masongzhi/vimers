import Timer from './timer';

function generateOptions(options, vm) {
  return Array.isArray(options)
    ? options.reduce((res, option) => {
        res[option.name] = new Timer(option, vm);
      }, {})
    : Object.keys(options).reduce((res, key) => {
        res[key] = new Timer({ ...options[key], name: key }, vm);
      }, {});
}

export default {
  data() {
    if (!this.$options.timers) return {};
    return {
      timers: generateOptions(this.$options.timers, this),
    };
  },

  mounted() {
    if (!this.$options.timers) return;
    Object.values(this.timers).forEach(timer => {
      if (timer.autostart) {
        timer.start();
      }
    });
  },

  activated() {
    if (!this.$options.timers) return;
    Object.values(this.timers).forEach(timer => {
      if (timer.isSwitchTab && timer.instance) {
        timer.start();
      }
    });
  },

  deactivated: function() {
    if (!this.$options.timers) return;
    Object.values(this.timers).forEach(timer => {
      if (timer.isSwitchTab && timer.instance) {
        timer.stop();
      }
    });
  },

  beforeDestroy() {
    if (!this.$options.timers) return;
    Object.values(this.timers).forEach(timer => {
      timer.stop();
    });
  },
};
