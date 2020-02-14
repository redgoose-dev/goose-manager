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
        :disabled="processing"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing"
        @click.stop="onClickSubmit">
        Set thumbnail
      </button-basic>
    </div>
  </nav>
</div>
</template>

<script>
import ResizeImage from 'image-resize';
import * as forms from "~/libs/forms";
import {formData} from "~/libs/forms";

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
  data()
  {
    return {
      processing: false,
    };
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
    window.on('keyup.thumbnail-editor', (e) => {
      if (e.key === 'Escape') this.onClickCancel();
    });
  },
  destroyed()
  {
    window.off('keyup.thumbnail-editor');
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

      this.processing = true;
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
        quality: .7,
        width: this.computedCroppieViewport.width,
        height: this.computedCroppieViewport.height,
        reSample: 4,
      });
      output = await resizeImage.play(output);

      // get article
      let article = await this.$axios.$get(`/${this.module}/${this.target_srl}/`);
      if (!article.success) throw new Error(article.message);
      article = article.data;

      try
      {
        // remove current thumbnail image
        if (article.json && article.json.thumbnail.path)
        {
          await this.$axios.$post(
            `/files/remove-file/`,
            forms.formData({ path: article.json.thumbnail.path })
          );
        }

        // upload new thumbnail image
        let res_uploadFile = await this.$axios.$post(
          `/files/upload-file/`,
          formData({
            sub_dir: 'thumbnail',
            base64: output,
          })
        );
        if (!res_uploadFile.success) throw new Error(res_uploadFile.message || 'Failed file upload.');
        if (!res_uploadFile.data.path) throw new Error('not found source path');

        // update article
        let newThumbnail = {
          ...((article.json && article.json.thumbnail) ? article.json.thumbnail : {}),
          srl: this.item.srl,
          path: res_uploadFile.data.path,
          points: pref.points,
          zoom: pref.zoom,
        };
        let res_edit = await this.$axios.$post(
          `/${this.module}/${this.target_srl}/edit/`,
          forms.formData({
            json: encodeURIComponent(JSON.stringify({ thumbnail: newThumbnail })),
          })
        );
        if (!res_edit.success) throw new Error(res_edit.message);
        this.processing = false;
        this.$emit('submit', newThumbnail, true);
      }
      catch(e)
      {
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed submit thumbnail editor.`,
          color: 'error',
        });
        this.processing = false;
      }
    },
  },
}
</script>

<style src="./thumbnail-editor.scss" lang="scss" scoped/>
