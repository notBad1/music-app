<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <!--使用组件时，组件内包括的内容会插入到slot插槽标签的位置上-->
      <slot></slot>
    </div>
    <div class="dots" v-show="showDot">
      <span class="dot-item" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom';
  import BScroll from 'better-scroll';

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      showDot: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      };
    },
    methods: {
//    设置宽度
      _setSlideWidth (isResize) {
        this.children = this.$refs.sliderGroup.children;
        let width = 0;
        let slideWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          child.style.width = slideWidth + 'px';
          width += slideWidth;
        }
        if (this.loop && !isResize) {
          width += 2 * slideWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
//    初始化滚动
      _initSlide () {
        this.slide = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          bounce: false
        });
        this.slide.on('scrollEnd', this._onScrollEnd);
        this.slide.on('touchend', () => {
          if (this.autoPlay) {
            this._play();
          }
        });
        this.slide.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer);
          }
        });
      },
//    滚动结束
      _onScrollEnd () {
        let pageIndex = this.slide.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          this._play();
        }
      },
//    初始化dots
      _initDots () {
        this.dots = new Array(this.children.length);
      },
//    自动滚动
      _play () {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slide.next();
        }, this.interval);
      },
//    重新计算 better-scroll
      refresh () {
        this._setSlideWidth(true);
        this.slide.refresh();
      }
    },
//  生命周期函数
    mounted () {
//     开始轮播图
      if (this.slide) {
        this.slide.destroy();
      }
      setTimeout(() => {
        clearTimeout(this.timer);
        this.currentPageIndex = 0;
        this._setSlideWidth();
        if (this.showDot) {
          this._initDots();
        }
        this._initSlide();
        if (this.autoPlay) {
          this._play();
        }
      }, 20);
      window.addEventListener('resize', () => {
        if (!this.slide || !this.slide.enabled) {
          return;
        }
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          if (this.slide.isInTransition) {
            this._onScrollEnd();
          } else {
            if (this.autoPlay) {
              this._play();
            }
          }
          this.refresh();
        }, 60);
      });
    },
    activated () {
      if (!this.slide) {
        return;
      }
      this.slide.enable();
      let pageIndex = this.slide.getCurrentPage().pageX;
      this.slide.goToPage(pageIndex, 0, 0);
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    deactivated () {
      this.slide.disable(); // 禁用 better-scroll
      clearTimeout(this.timer);
    },
    beforeDestroy () {
      this.slide.disable(); // 禁用 better-scroll
      clearTimeout(this.timer);
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .slider
    position relative
    width 100%
    overflow hidden
    .slider-group
      height: 150px
      overflow: hidden
      .slider-item
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
