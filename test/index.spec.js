import { mount, createLocalVue } from '@vue/test-utils'
import vimers from '../src'

const localVue = createLocalVue()
localVue.use(vimers)

const component = {
  template: '<div></div>',
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
      localVue,
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
