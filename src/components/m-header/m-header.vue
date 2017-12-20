<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script type="text/ecmascript-6">
//  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .m-header
    position relative
    display flex
    justify-content center
    align-items center
    height 44px
    text-align center
    color $color-theme
    font-size $font-size-large
    .icon
      width 30px
      height 32px
      margin-right 9px
      bg-image(logo)
      background-size 30px 32px
</style>
