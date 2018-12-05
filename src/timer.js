function clearTimer(repeat) {
  return repeat ? clearInterval : clearTimeout;
}

function setTimer(repeat) {
  return repeat ? setInterval : setTimeout;
}

function generateTimer(timer) {
  return setTimer(timer.repeat)(() => {
    timer.vm.$emit('timer-tick:' + timer.name);
    timer.callback();
  }, timer.time);
}

export default class Timer {
  constructor(option, vm) {
    if (process.env.NODE_ENV !== 'production') {
      if (!option.name) {
        throw new Error('[vimers.create] name is required');
      }
      if (!option.callback && typeof vm[option.name] !== 'function') {
        throw new ReferenceError('[vimers.create] Cannot find method ' + option.name);
      }
      if (option.callback && typeof option.callback !== 'function') {
        throw new TypeError(
          '[vimers.create] Timer callback should be a function, ' +
            typeof option.callback +
            ' given'
        );
      }
    }

    this.name = option.name;
    this.time = option.time || 0;
    this.repeat = 'repeat' in option ? option.repeat : false;
    this.immediate = 'immediate' in option ? option.immediate : false;
    this.autostart = 'autostart' in option ? option.autostart : false;
    this.isSwitchTab = 'isSwitchTab' in option ? option.isSwitchTab : false;
    this.callback = (option.callback && option.callback.bind(vm)) || vm[option.name];
    this.instance = null;
    this.isRunning = false;
    this.vm = vm;
  }
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.instance = generateTimer(this);
    if (this.immediate) {
      this.vm.$emit('timer-tick:' + this.name);
      this.callback();
    }
    this.vm.$emit('timer-start:' + this.name);
  }
  stop() {
    if (!this.isRunning) return;
    clearTimer(this.repeat)(this.instance);
    this.isRunning = false;
    this.vm.$emit('timer-stop:' + this.name);
  }
  restart() {
    this.stop();
    this.start();
    this.vm.$emit('timer-restart:' + this.name);
  }
}
