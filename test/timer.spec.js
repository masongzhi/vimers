import { mount } from '@vue/test-utils'
import Timer from '../src/timer'

const component = {
  template: '<div></div>',
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    log() {
      this.count++
    },
  },
}

describe('test class Timer', () => {
  afterAll(() => {
    // clear all timeout
    let id = setTimeout(() => {}, 0)
    while (id--) {
      clearTimeout(id)
    }
  })

  it('test ERROR "name is required"', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
    }
    try {
      new Timer(option, wrapper.vm)
    } catch (e) {
      expect(e).toEqual(new Error('[vimers.create] name is required'))
    }
  })

  it('test ERROR "Cannot find callback"', () => {
    const wrapper = mount(component)
    const option = {
      name: 'notExist',
      time: 1000,
    }
    try {
      new Timer(option, wrapper.vm)
    } catch (e) {
      expect(e).toEqual(
        new ReferenceError('[vimers.create] Cannot find method notExist')
      )
    }
  })

  it('test ERROR "Timer callback should be a function"', () => {
    const wrapper = mount(component)
    const option = {
      name: 'notExist',
      time: 1000,
      callback: true,
    }
    try {
      new Timer(option, wrapper.vm)
    } catch (e) {
      expect(e).toEqual(
        new TypeError(
          '[vimers.create] Timer callback should be a function, boolean given'
        )
      )
    }
  })

  it('should be use default option', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
    }
    const timer = new Timer(option, wrapper.vm)
    expect(timer.name).toBe(option.name)
    expect(timer.time).toBe(option.time)
    expect(timer.repeat).toBe(false)
    expect(timer.immediate).toBe(false)
    expect(timer.callback).toEqual(wrapper.vm.log)

    expect(timer.instance).toBe(null)
    expect(timer.isRunning).toBe(false)
    expect(timer.vm).toBe(wrapper.vm)
  })

  it('test timer start method', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
    }
    const timer = new Timer(option, wrapper.vm)
    timer.start()
    expect(timer.isRunning).toBe(true)
    expect(wrapper.emitted()['timer-start:log']).toBeTruthy()
  })

  it('test timer stop method', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
    }
    const timer = new Timer(option, wrapper.vm)
    timer.start()
    timer.stop()
    expect(timer.isRunning).toBe(false)
    expect(wrapper.emitted()['timer-stop:log']).toBeTruthy()
  })

  it('test timer restart method', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
    }
    const timer = new Timer(option, wrapper.vm)
    timer.restart()
    expect(timer.isRunning).toBe(true)
    expect(wrapper.emitted()['timer-restart:log']).toBeTruthy()
  })

  it('test timer start method with immediate', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
      immediate: true,
    }
    const timer = new Timer(option, wrapper.vm)
    timer.start()
    expect(timer.isRunning).toBe(true)
    expect(wrapper.emitted()['timer-tick:log']).toBeTruthy()
    expect(wrapper.vm.count).toBe(1)
    expect(wrapper.emitted()['timer-start:log']).toBeTruthy()
  })
})

describe('test class Timer with useFakeTimers', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('test timer start method', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
    }
    const timer = new Timer(option, wrapper.vm)
    timer.start()
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
    expect(wrapper.vm.count).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(1)
  })

  it('test timer stop method', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
    }
    const timer = new Timer(option, wrapper.vm)
    timer.start()
    timer.stop()
    expect(wrapper.vm.count).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(0)
  })

  it('test timer restart method', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
    }
    const timer = new Timer(option, wrapper.vm)
    timer.start()
    timer.restart()
    expect(wrapper.vm.count).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(1)
  })
})

describe('test execute methods much times', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('test execute timer start method twice', () => {
    const wrapper = mount(component)
    const option = {
      name: 'log',
      time: 1000,
    }
    const timer = new Timer(option, wrapper.vm)
    timer.start()
    timer.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })
})
