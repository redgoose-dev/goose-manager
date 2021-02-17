<template>
<article class="checklist">
  <page-header module="checklist">
    <button-icon
      href="/checklist/items/"
      icon-name="archive"
      title="Open checklist items"
      class="checklist__header-button"/>
  </page-header>
  <article class="checklist__wrap">
    <h3 class="checklist__date">{{computedDate}}</h3>
    <div ref="checklist-body" class="redgoose-body redgoose-body--dark checklist__body"/>
  </article>
  <checklist-progress
    :percent="computedPercent"
    class="checklist__progress"
    @edit-item="onClickEdit"/>
  <nuxt-child @action="actionChildren"/>
</article>
</template>

<script>
import marked from 'marked';
import * as messages from '~/libs/messages';
import { checkTime, convertDateFormat, countingCheckbox, replaceMark, defaultContent } from '~/components/pages/checklist/src';
import { checkToday } from '~/libs/dates';

export default {
  name: 'page-checklist',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-icon': () => import('~/components/button/icon'),
    'checklist-progress': () => import('~/components/pages/checklist/progress'),
  },
  async asyncData(context)
  {
    const { store, $axios } = context;
    const { preference } = store.state;
    try
    {
      let item;
      let res = await $axios.$get(`/checklist/?order=srl&sort=desc&size=1`);
      let lastItem = res?.data?.index[0];
      if (!lastItem || (!!lastItem && checkTime(lastItem.regdate, preference.checklist.reset)))
      {
        // add item
        let res = await $axios.$post('/checklist/?return=1', {
          content: (lastItem?.content) ? lastItem.content.replace(/\- \[x\]/g, '- [ ]') : defaultContent,
        });
        item = res?.data;
      }
      else
      {
        item = lastItem;
      }
      return {
        srl: Number(item.srl),
        content: item.content,
        regdate: item.regdate,
      };
    }
    catch(e)
    {
      return { error: (typeof e === 'string') ? e : messages.error.service };
    }
  },
  computed: {
    computedDate()
    {
      const { preference } = this.$store.state;
      const regdate = this.regdate.split('-').map(o => Number(o));
      return convertDateFormat(new Date(regdate[0], regdate[1]-1, regdate[2]), preference.checklist.format);
    },
    computedPercent()
    {
      if (!this.content) return 0;
      const { percent } = countingCheckbox(this.content);
      return percent;
    },
    computedToday()
    {
      const regdate = this.regdate.split('-').map(o => Number(o));
      return checkToday(new Date(regdate[0], regdate[1]-1, regdate[2]));
    },
  },
  watch: {
    srl: async function()
    {
      // TODO
      console.log('change srl / call');
    },
  },
  mounted()
  {
    this.$body = this.$refs['checklist-body'];
    this.processingEditContent = false;
    this.resetContent();
  },
  methods: {
    actionChildren(action)
    {
      // TODO
      console.log('call action children');
      switch (action)
      {}
    },
    async resetContent()
    {
      const onChangeCheckbox = e => {
        const index = Number(e.target.dataset?.index);
        const checkMark = e.target.checked ? 'x' : ' ';
        let body = replaceMark(this.content, /\- \[[x|\s]\]/gmi, `- [${checkMark}]`, index + 1);
        this.editContent(body);
      }

      // clear content
      this.$body.innerHTML = '';
      // set marked renderer
      const renderer = new marked.Renderer();
      renderer.listitem = (text, task) => {
        if (task)
        {
          text = text.replace(`disabled="" `, ``);
          return `<li class="checkbox-item"><label>${text}</label></li>`;
        }
        else
        {
          return `<li>${text}</li>`;
        }
      };
      let parsed = marked(this.content, { renderer });
      if (!parsed) return '';
      // input content
      this.$body.innerHTML = parsed;
      // set events
      const checkboxElements = this.$body.querySelectorAll('input[type=checkbox]');
      checkboxElements.forEach((o, k) => {
        let wrapper = document.createElement('label');
        wrapper.classList.add('checkbox');
        o.parentNode.insertBefore(wrapper, o);
        wrapper.appendChild(o);
        wrapper.appendChild(document.createElement('i'));
        if (this.computedToday)
        {
          o.setAttribute('data-index', String(k));
          o.addEventListener('change', onChangeCheckbox);
        }
        else
        {
          o.setAttribute('disabled', 'disabled');
        }
      });
    },
    async editContent(str)
    {
      this.content = str;
      if (this.processingEditContent) return;
      this.processingEditContent = true;
      await this.$axios.$post(`/checklist/${this.srl}/edit/`, { content: str });
      this.processingEditContent = false;
    },
    async onClickEdit()
    {
      console.log('call onClickEdit');
    },
  },
}
</script>

<style src="./checklist-scoped.scss" lang="scss" scoped></style>
<style src="./checklist.scss" lang="scss"></style>
