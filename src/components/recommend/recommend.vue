<template>
  <div class="recommend">
    <div class="content">
      <div v-if="recommends.length" class="slider-wrapper">
        <slider>
          <div v-for="item in recommends" :key="item.id">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" alt="">
            </a>
          </div>
        </slider>
      </div>
      <div class="songSheet-wrapper">
        <h1 class="title">热门歌单推荐</h1>
        <ul>
          <li v-for="item in recommends" :key="item.id"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from 'api/recommend';
  import {ERR_OK} from 'api/config';

  import slider from 'base/slider/slider';

  export default {
    data () {
      return {
        recommends: [], // 轮播图数据
        discList: []  // 热门歌单推荐
      };
    },
    components: {
      slider
    },
    methods: {
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        });
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data);
            this.discList = res.data.recomPlaylist;
          }
        });
      }
    },
    created () {
      this._getRecommend();
      this._getDiscList();
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .recommend
    position fixed
    top 88px
    bottom 0
    width 100%
    .content
      .slider-wrapper
        width 100%
        overflow hidden
      .songSheet-wrapper
        .title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme

</style>
