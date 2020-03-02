<template>
<div
  :class="[
    'thumbnail-editor',
    full && 'thumbnail-editor--full',
  ]">
  <div class="thumbnail-editor__body">
    <div class="thumbnail-editor__croppie">
      <vue-croppie
        ref="croppie"
        :enable-orientation="false"
        :boundary="computedCroppieBoundary"
        :viewport="computedCroppieViewport"
        :enableResize="false"
        :mouseWheelZoom="true"/>
    </div>
  </div>
  <nav class="thumbnail-editor__nav">
    <div>
      <button-basic type="button" icon-left="x" @click="onClickCancel">Cancel</button-basic>
    </div>
    <div>
      <button-basic
        type="button"
        color="key"
        icon-left="check"
        @click.stop="onClickSubmit">
        Set thumbnail
      </button-basic>
    </div>
  </nav>
</div>
</template>

<script>
import ResizeImage from 'image-resize';

export default {
  name: 'thumbnail-editor',
  components: {
    'button-basic': () => import('~/components/button/basic'),
  },
  props: {
    item: {},
    module: { type: String, default: 'articles' },
    target_srl: { type: Number, default: null },
    croppie: {},
    thumbnail: {},
    full: { type: Boolean, default: false },
  },
  computed: {
    computedCroppieBoundary()
    {
      return Object.assign({}, {
        width: 640,
        height: 480,
      }, this.croppie.boundary);
    },
    computedCroppieViewport()
    {
      return Object.assign({}, {
        width: 240,
        height: 240,
        type: 'square',
      }, this.croppie.viewport);
    },
  },
  mounted()
  {
    const { url_api } = this.$store.state;
    const checkSrl = this.thumbnail.srl === this.item.srl;
    this.$refs.croppie.bind({
      url: `${url_api}/${this.item.path}`,
      points: checkSrl ? (this.thumbnail.points || []) : [],
      zoom: checkSrl ? (this.thumbnail.zoom || .25) : .25,
    });
    this.$emit('control-window', { action: 'open', code: 'thumbnail-editor' });
  },
  destroyed()
  {
    this.$emit('control-window', { action: 'close' });
  },
  methods: {
    // 크롭 에디터 닫기
    onClickCancel()
    {
      if (this.$refs.croppie) this.$refs.croppie.destroy();
      this.$emit('close');
    },
    // 크롭 데이터 서브밋
    async onClickSubmit()
    {
      const { croppie } = this.$refs;
      let pref = croppie.get();

      let output = await croppie.result({
        type: 'base64',
        format: 'png',
        size: {
          width: this.computedCroppieViewport.width * 2,
          height: this.computedCroppieViewport.height * 2,
        },
      });

      // resize image
      let resizeImage = new ResizeImage({
        format: 'jpg',
        outputType: 'base64',
        quality: .6,
        width: this.computedCroppieViewport.width,
        height: this.computedCroppieViewport.height,
        reSample: 4,
      });
      output = await resizeImage.play(output);

      // update article
      let newThumbnail = {
        ...this.thumbnail,
        srl: this.item.srl,
        points: pref.points,
        zoom: pref.zoom,
      };

      this.$emit('submit', newThumbnail, output);
    },
  },
}
</script>

<style src="./thumbnail-editor.scss" lang="scss" scoped/>
