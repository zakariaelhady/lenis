import { createNanoEvents } from 'nanoevents'
import { version } from '../package.json'
import { Animate } from './animate'
import { clamp, clampedModulo } from './maths'
import { ObservedElement } from './observed-element'
import { VirtualScroll } from './virtual-scroll.js'

export default class Lenis {
  #options
  #wrapper // element with hidden overflow
  #content // wrapper direct child with scrollable content
  #animate
  #emitter
  #virtualScroll
  #time
  #velocity
  #direction
  #animatedScroll // value used for animation
  #targetScroll // value to reach
  #_isScrolling // true when scroll is animated programatically
  #_isStopped // true if user should not be able to scroll - enable/disable programatically
  #_isSmooth // true if scroll shoul be animated
  #isLocked // same as isStopped - enable/disable when scroll reaches target

  /**
   * @typedef {(t: number) => number} EasingFunction
   * @typedef {'vertical' | 'horizontal'} Orientation
   * @typedef {'vertical' | 'horizontal' | 'both'} GestureOrientation
   *
   * @typedef LenisOptions
   * @property {Orientation} [direction]
   * @property {GestureOrientation} [gestureDirection]
   * @property {number} [mouseMultiplier]
   * @property {boolean} [smooth]
   *
   * @property {Window | HTMLElement} [wrapper]
   * @property {HTMLElement} [content]
   * @property {boolean} [smoothWheel]
   * @property {boolean} [smoothTouch]
   * @property {number} [duration]
   * @property {EasingFunction} [easing]
   * @property {number} [lerp]
   * @property {boolean} [infinite]
   * @property {Orientation} [orientation]
   * @property {GestureOrientation} [gestureOrientation]
   * @property {number} [touchMultiplier]
   * @property {number} [wheelMultiplier]
   * @property {number} [normalizeWheel]
   *
   * @param {LenisOptions}
   */
  constructor({
    //--legacy options--//
    direction,
    gestureDirection,
    mouseMultiplier,
    smooth,
    //--legacy options--//
    wrapper = window,
    content = document.documentElement,
    smoothWheel = smooth ?? true,
    smoothTouch = false,
    duration, // in seconds
    easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    lerp = duration ? null : 0.1,
    infinite = false,
    orientation = direction ?? 'vertical', // vertical, horizontal
    gestureOrientation = gestureDirection ?? 'vertical', // vertical, horizontal, both
    touchMultiplier = 2,
    wheelMultiplier = mouseMultiplier ?? 1,
    normalizeWheel = true,
  } = {}) {
    // warn about legacy options
    if (direction) {
      console.warn(
        'Lenis: `direction` option is deprecated, use `orientation` instead'
      )
    }
    if (gestureDirection) {
      console.warn(
        'Lenis: `gestureDirection` option is deprecated, use `gestureOrientation` instead'
      )
    }
    if (mouseMultiplier) {
      console.warn(
        'Lenis: `mouseMultiplier` option is deprecated, use `wheelMultiplier` instead'
      )
    }
    if (smooth) {
      console.warn(
        'Lenis: `smooth` option is deprecated, use `smoothWheel` instead'
      )
    }

    window.lenisVersion = version

    // if wrapper is html or body, fallback to window
    if (wrapper === document.documentElement || wrapper === document.body) {
      wrapper = window
    }

    this.#options = {
      wrapper,
      content,
      smoothWheel,
      smoothTouch,
      duration,
      easing,
      lerp,
      infinite,
      gestureOrientation,
      orientation,
      touchMultiplier,
      wheelMultiplier,
      normalizeWheel,
    }

    this.#wrapper = new ObservedElement(wrapper)
    this.#content = new ObservedElement(content)

    this.#classElement.classList.add('lenis')

    this.#velocity = 0
    this.#isStopped = false
    this.#isSmooth = smoothWheel || smoothTouch
    this.#isScrolling = false
    this.#targetScroll = this.#animatedScroll = this.#actualScroll
    this.#animate = new Animate()
    this.#emitter = createNanoEvents()

    this.#wrapper.element.addEventListener('scroll', this.#onScroll, {
      passive: false,
    })

    this.#virtualScroll = new VirtualScroll(wrapper, {
      touchMultiplier,
      wheelMultiplier,
      normalizeWheel,
    })
    this.#virtualScroll.on('scroll', this.#onVirtualScroll)
  }

  destroy() {
    this.#emitter.events = {}

    this.#wrapper.element.removeEventListener('scroll', this.#onScroll, {
      passive: false,
    })

    this.#virtualScroll.destroy()
  }

  on(event, callback) {
    return this.#emitter.on(event, callback)
  }

  #setScroll(scroll) {
    if (this.#options.infinite) {
      scroll = this.scroll
    }

    // apply scroll value immediately
    if (this.isHorizontal) {
      this.#classElement.scrollLeft = scroll
    } else {
      this.#classElement.scrollTop = scroll
    }
  }

  #onVirtualScroll = ({ type, deltaX, deltaY, event }) => {
    // keep zoom feature
    if (event.ctrlKey) return

    // keep previous/next page gesture on trackpads
    if (
      (this.#options.gestureOrientation === 'vertical' && deltaY === 0) ||
      (this.#options.gestureOrientation === 'horizontal' && deltaX === 0)
    )
      return

    // catch if scrolling on nested scroll elements
    if (
      !!event
        .composedPath()
        .find((node) => node?.hasAttribute?.('data-lenis-prevent'))
    )
      return

    if (this.isStopped || this.#isLocked) {
      event.preventDefault()
      return
    }

    this.#isSmooth =
      (this.#options.smoothTouch && type === 'touch') ||
      (this.#options.smoothWheel && type === 'wheel')

    if (!this.isSmooth) return

    event.preventDefault()

    let delta = deltaY
    if (this.#options.gestureOrientation === 'both') {
      delta = deltaX + deltaY
    } else if (this.#options.gestureOrientation === 'horizontal') {
      delta = deltaX
    }

    this.scrollTo(this.#targetScroll + delta, {}, false)
  }

  emit() {
    this.#emitter.emit('scroll', this)
  }

  #onScroll = () => {
    if (!this.isScrolling) {
      const lastScroll = this.#animatedScroll
      this.#animatedScroll = this.#targetScroll = this.#actualScroll
      this.#velocity = 0
      this.#direction = Math.sign(this.#animatedScroll - lastScroll)
      this.emit()
    }
  }

  start() {
    this.#isStopped = false
  }

  stop() {
    this.#isStopped = true
  }

  raf(time) {
    const deltaTime = time - (this.#time || time)
    this.#time = time

    this.#animate.advance(deltaTime * 0.001)
  }

  scrollTo(
    target,
    {
      offset = 0,
      immediate = false,
      lock = false,
      duration = this.#options.duration,
      easing = this.#options.easing,
      lerp = this.#options.lerp,
      onComplete,
    } = {},
    programmatic = true // called from outside of the class
  ) {
    // keywords
    if (['top', 'left', 'start'].includes(target)) {
      target = 0
    } else if (['bottom', 'right', 'end'].includes(target)) {
      target = this.limit
    } else {
      let node

      if (typeof target === 'string') {
        // CSS selector
        node = document.querySelector(target)
      } else if (target?.nodeType) {
        // Node element
        node = target
      }

      if (node) {
        if (this.#wrapper.element !== window) {
          // nested scroll offset correction
          const wrapperRect = this.#wrapper.element.getBoundingClientRect()
          offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top
        }

        const rect = node.getBoundingClientRect()

        target =
          (this.isHorizontal ? rect.left : rect.top) + this.#animatedScroll
      }
    }

    if (typeof target !== 'number') return

    target += offset

    if (this.#options.infinite) {
      if (programmatic) {
        this.#targetScroll = this.#animatedScroll = this.scroll
      }
    } else {
      target = clamp(0, target, this.limit)
    }

    // if (this.#scroll === target) {
    if (this.#animatedScroll === target) {
      onComplete?.()
      return
    }

    if (immediate) {
      this.#animatedScroll = this.#targetScroll = target
      this.#setScroll(target)
      this.emit()
      onComplete?.()
      return
    }

    if (!programmatic) {
      this.#targetScroll = target
    }

    this.#animate.fromTo(this.#animatedScroll, target, {
      duration,
      easing,
      lerp,
      onStart: () => {
        // user is scrolling
        if (lock) this.#isLocked = true
        this.#isScrolling = true
      },
      onUpdate: (value) => {
        this.#velocity = value - this.#animatedScroll
        this.#direction = Math.sign(this.#velocity)

        this.#animatedScroll = value
        this.#setScroll(value)

        if (programmatic) {
          // fix velocity during programmatic scrollTo
          // wheel during programmatic should stop it
          this.#targetScroll = value
        }

        this.emit()
      },
      onComplete: (value) => {
        // user is not scrolling anymore
        if (lock) this.#isLocked = false
        requestAnimationFrame(() => {
          this.#isScrolling = false
        })
        this.#velocity = 0
        this.emit()

        onComplete?.()
      },
    })
  }

  get options() {
    return { ...this.#options }
  }

  get #classElement() {
    return this.#wrapper.element === window
      ? this.#content.element
      : this.#wrapper.element
  }

  get limit() {
    return this.isHorizontal
      ? this.#content.width - this.#wrapper.width
      : this.#content.height - this.#wrapper.height
  }

  get isHorizontal() {
    return this.#options.orientation === 'horizontal'
  }

  get #actualScroll() {
    // value browser takes into account
    return this.#classElement.scrollTop
  }

  get scroll() {
    return clampedModulo(this.#animatedScroll, this.limit)
  }

  get progress() {
    return this.scroll / this.limit
  }

  get velocity() {
    return this.#velocity
  }

  get direction() {
    return this.#direction
  }

  get isSmooth() {
    return this.#_isSmooth
  }

  set #isSmooth(value) {
    if (this.#_isSmooth !== value) {
      this.#classElement.classList.toggle('lenis-smooth', value)
    }
    this.#_isSmooth = value
  }

  get isScrolling() {
    return this.#_isScrolling
  }

  set #isScrolling(value) {
    if (this.#_isScrolling !== value) {
      this.#classElement.classList.toggle('lenis-scrolling', value)
    }
    this.#_isScrolling = value
  }

  get isStopped() {
    return this.#_isStopped
  }

  set #isStopped(value) {
    if (this.#_isStopped !== value) {
      this.#classElement.classList.toggle('lenis-stopped', value)
    }
    this.#_isStopped = value
  }
}
