import Timer from './timer'

function generateOptions(options) {
  return Array.isArray(options)
    ? options.reduce((res, option) => {
        res[option.name] = option
        return res
      }, {})
    : options
}

function generateData(options, vm) {
  return Object.keys(options).reduce((res, key) => {
    res[key] = new Timer({ ...options[key], name: key }, vm)
    return res
  }, {})
}

const METHODS = ['start', 'stop', 'restart']

export default {
  data() {
    if (!this.$options.timers) return {}
    this.$options.timers = generateOptions(this.$options.timers)
    return {
      timers: generateData(this.$options.timers, this),
    }
  },

  created() {
    if (!this.$options.timers) return
    this.$timer = METHODS.reduce((res, method) => {
      res[method] = name => {
        if (
          process.env.NODE_ENV !== 'production' &&
          !(name in this.$options.timers)
        ) {
          throw new ReferenceError(
            `[vimers.${method}] Cannot find timer ${name}`
          )
        }
        this.timers[name][method]()
      }
      return res
    }, {})
  },

  mounted() {
    if (!this.$options.timers) return
    const options = this.$options.timers
    Object.keys(options).forEach(key => {
      if (options[key].autostart) {
        this.$timer.start(key)
      }
    })
  },

  activated() {
    if (!this.$options.timers) return
    const data = this.timers
    const options = this.$options.timers
    Object.keys(options).forEach(key => {
      if (options[key].isSwitchTab && data[key].instance) {
        this.$timer.start(key)
      }
    })
  },

  deactivated: function() {
    if (!this.$options.timers) return
    const data = this.timers
    const options = this.$options.timers
    Object.keys(options).forEach(key => {
      if (options[key].isSwitchTab && data[key].instance) {
        this.$timer.stop(key)
      }
    })
  },

  beforeDestroy() {
    if (!this.$options.timers) return
    Object.keys(this.$options.timers).forEach(key => {
      this.$timer.stop(key)
    })
  },
}
