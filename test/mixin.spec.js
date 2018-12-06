import { mount } from '@vue/test-utils'
import mixin from '../src/mixin'

const component = {
  template: '<div></div>',
  mixins: [mixin],
  timers: {
    log: { time: 1000 },
  },
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

describe('test mixin', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('test $timer ERROR', () => {
    const wrapper = mount(component)
    try {
      wrapper.vm.$timer.start('notExist')
    } catch (e) {
      expect(e).toEqual(
        new ReferenceError('[vimers.start] Cannot find timer notExist')
      )
    }
  })

  it('test options is a array', () => {
    const wrapper = mount(component, {
      timers: [{ name: 'log', time: 1000 }],
    })
    expect(wrapper.vm.timers).toEqual({
      log: {
        callback: expect.any(Function),
        immediate: false,
        isRunning: false,
        repeat: false,
        instance: null,
        name: 'log',
        time: 1000,
        vm: wrapper.vm,
      },
    })
  })

  it('test $timer methods', () => {
    const wrapper = mount(component)
    wrapper.vm.$timer.start('log')
    expect(wrapper.vm.count).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(1)
    expect(wrapper.emitted()['timer-start:log']).toBeTruthy()

    wrapper.vm.$timer.stop('log')
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(1)
    expect(wrapper.emitted()['timer-stop:log']).toBeTruthy()

    wrapper.vm.$timer.restart('log')
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(2)
    expect(wrapper.emitted()['timer-restart:log']).toBeTruthy()
  })

  it('test timers methods', () => {
    const wrapper = mount(component)
    wrapper.vm.timers.log.start()
    expect(wrapper.vm.count).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(1)

    wrapper.vm.timers.log.stop()
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(1)

    wrapper.vm.timers.log.restart()
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(2)
  })

  it('test autostart timers', () => {
    const wrapper = mount(component, {
      timers: {
        log: { time: 1000, autostart: true },
      },
    })
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(1)
  })

  it('test immediate timers', () => {
    const wrapper = mount(component, {
      timers: {
        log: { time: 1000, immediate: true },
      },
    })
    wrapper.vm.timers.log.start()
    expect(wrapper.vm.count).toBe(1)
  })

  it('test beforeDestroy hook will execute stop timers', () => {
    const wrapper = mount(component)
    wrapper.vm.timers.log.start()
    wrapper.destroy()
    expect(wrapper.emitted()['timer-stop:log']).toBeTruthy()
  })
})
