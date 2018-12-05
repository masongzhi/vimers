import mixin from './mixin';

export default function(Vue) {
  // Vue.config.optionMergeStrategies.timers = Vue.config.optionMergeStrategies.methods
  Vue.mixin(mixin);
}
