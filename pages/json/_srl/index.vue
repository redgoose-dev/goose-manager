<template>
<article>
  <page-header module="json" :title="data.name" :description="`${description}`" :eng="true"/>
  <pre class="json"><code>{{json}}</code></pre>
  <div v-if="!!data.description" class="description">
    <p>{{data.description}}</p>
  </div>
  <nav-bottom>
    <template slot="left">
      <button-basic :href="`/json/`" icon-left="list">Index</button-basic>
    </template>
    <template slot="right">
      <button-basic :href="`/json/${srl}/edit/`" icon-left="edit">Edit</button-basic>
      <button-basic :href="`/json/${srl}/delete/`" color="key" icon-left="trash">Delete</button-basic>
    </template>
  </nav-bottom>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
  },
  validate(cox)
  {
    return cox.params.srl && /^\d+$/.test(cox.params.srl);
  },
  data()
  {
    return {
      srl: parseInt(this.$route.params.srl),
      error: '',
      processing: false,
    };
  },
  async asyncData(cox)
  {
    try
    {
      let srl = parseInt(cox.params.srl);
      let res = await cox.$axios.$get(`/json/${srl}/`);
      if (!res.success) throw res.message;
      return {
        data: res.data,
        description: `regdate: ${dates.getFormatDate(res.data.regdate, true)}`,
        json: JSON.stringify(res.data.json, null, 2),
        error: null,
      };
    }
    catch(e)
    {
      cox.error({
        statusCode: 500,
        message: (typeof e === 'string') ? e : messages.error.service,
      });
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";

.description {
  margin: 1rem 0;
  > p {
    margin: 2px 0 0;
    font-size: .875rem;
    color: var(--color-blur);
  }
}
.json {
  padding: 1.5rem;
  border: 1px solid var(--color-content-line);
  background: var(--color-content-bg);
  font-size: 14px;
  overflow: auto;
}
</style>
