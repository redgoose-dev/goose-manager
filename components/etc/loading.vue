<template>
<div :class="[ 'loading', move && 'loading-move' ]">
	<div v-if="show" class="loading__loader">
		<div class="loading__shadow"/>
		<div class="loading__box"/>
	</div>
</div>
</template>

<script>
import * as util from '~/libs/util';

let mounted = false;

export default {
  props: {
    move: { type: Boolean, default: false }
  },
  data()
  {
    return {
      show: false
    };
  },
  mounted()
  {
    mounted = true;
    util.sleep(50).then(() => {
      if (mounted) this.show = true;
    });
  },
  beforeDestroy()
  {
    mounted = false;
  },
}
</script>

<style src="./loading.scss" lang="scss" scoped/>
