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

describe('global import', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('test setTimeout', () => {
    const wrapper = mount(component, {
      timers: {
        log: { time: 1000 },
      },
    })

    wrapper.vm.$timer.start('log')
    expect(wrapper.vm.timers.log.isRunning).toBe(true)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)

    expect(wrapper.vm.count).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(1)

    wrapper.vm.$timer.stop('log')
    expect(wrapper.vm.timers.log.isRunning).toBe(false)
  })
})
