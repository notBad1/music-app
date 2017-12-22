<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <!--使用组件时，组件内包括的内容会插入到slot这个标签的位置上-->
      <slot></slot>
    </div>
    <div class="dots" v-show="showDot">
      <span class="dot-item" :class="{active: currentPageIndex === item }" v-for="item in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      loop: { // 循环播放
        type: Boolean,
        default: true
      },
      autoPlay: { // 自动播放
        type: Boolean,
        default: true
      },
      interval: { // 循环时间间隔
        type: Number,
        default: 3000
      },
      showDot: { // 是否显示 dot
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
//   el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
    mounted () {
      this.update()
      window.addEventListener('resize', () => { //  事件会在窗口或框架被调整大小时发生。
        if (!this.slide || !this.slide.enabled) {
          return
        }
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.slide.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refresh()
        }, 60)
      })
    },
//    keep-alive 组件激活时调用。
    activated () {
      if (!this.slide) {
        return
      }
      this.slide.enable()
      let pageIndex = this.slide.getCurrentPage().pageX
      this.slide.goToPage(pageIndex, 0, 0)
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
//    keep-alive 组件停用时调用。
    deactivated () {
      this.slide.disable()
      clearTimeout(this.timer)
    },
//    实例销毁之前调用。在这一步，实例仍然完全可用。
    beforeDestroy () {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    methods: {
      update () { // 更新
        if (this.slide) {
          this.slide.destroy() // 销毁 better-scroll，解绑事件。
        }
        setTimeout(() => {
          this.init()
        }, 100)
      },
      refresh () { // 刷新
        this._setSlideWidth(true)
        this.slide.refresh() // 刷新
      },
      next () { // 滚动到下一个页面
        this.slide.next()
      },
      init () { // 初始化
        clearTimeout(this.timer)
        this.currentPageIndex = 0
        this._setSlideWidth()
        if (this.showDot) {
          this._initDots()
        }
        this._initSlide()
        if (this.autoPlay) {
          this._play()
        }
      },
      _setSlideWidth (isResize) {
        this.children = this.$refs.sliderGroup.childNodes
        let width = 0
        let slideWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          child.style.width = slideWidth + 'px'
          width += slideWidth
        }
        if (this.loop && !isResize) {
          width += 2 * slideWidth
        }

        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlide () {
        this.slide = new BScroll(this.$refs.slider, { // better-scroll实例
          scrollX: true, // 当设置为 true 的时候，可以开启横向滚动
          // 当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画。设置为 true 则开启动画
          momentum: false,
          //  这个配置是为了做 slide 组件用的，默认为 false，
          // 如果开启则需要配置一个 Object，例如：* snap: {loop: false,threshold: 0.1,stepX: 100,stepY: 100}，
          // 注意：loop 为 true 是为了支持横向循环轮播，并不支持纵向。
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        })
        //  滚动结束。 触发事件
        this.slide.on('scrollEnd', this._onScrollEnd)
        //        鼠标/手指离开 触发事件
        this.slide.on('touchend', () => {
          if (this.autoPlay) {
            this._play()
          }
        })
        //  滚动开始之前。
        this.slide.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
//      滚动结束后事件
      _onScrollEnd () {
        let pageIndex = this.slide.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          this._play()
        }
      },
//      初始化Dot
      _initDots () {
        for (let i = 0; i < this.children.length; i++) {
          this.dots.push(i)
        }
      },
//      滚动
      _play () {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slide.next()
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .slider
    position relative
    width 100%
    overflow hidden
    .slider-group
      .slider-item
        box-sizing border-box
        float left
        display inline-block
        a
          display block
          width 100%
          text-decoration none
          img
            display block
            width 100%
    .dots
      position absolute
      left 0
      right 0
      bottom 5px
      text-align center
      font-size 0
      .dot-item
        display inline-block
        width 6px
        height 6px
        margin: 0 4px
        border-radius 50%
        background-color $color-text-l
        &.active
          width: 20px
          border-radius 5px
          background-color $color-text-ll
</style>
