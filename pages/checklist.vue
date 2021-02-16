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
    <header class="checklist__head">
      <h3>{{computedDate}}</h3>
    </header>
    <div ref="checklist-body" class="checklist__body"/>
    {{computedToday}}
  </article>
  <checklist-progress
    :percent="computedPercent"
    class="checklist__progress"/>
  <nuxt-child @update="updateChildren"/>
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
    const { query, store, $axios } = context;
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
      console.log('change srl / call');
    },
  },
  mounted()
  {
    this.$body = this.$refs['checklist-body'];
    this.resetContent();
  },
  methods: {
    updateChildren(action)
    {
      console.log('call update children');
    },
    async resetContent()
    {
      const onChangeCheckbox = e => {
        const index = Number(e.target.dataset?.index);
        const checkMark = e.target.checked ? 'x' : ' ';
        let body = replaceMark(
          this.content,
          /\- \[[x|\s]\]/gmi,
          `- [${checkMark}]`,
          index + 1
        );
        // 수정된 소스로 호출한곳으로 콜백 이벤트로 호출한다.
        this.editContent(body).then();
      }

      // clear content
      this.$body.innerHTML = '';
      // set renderer
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
      let res = await this.$axios.$post(`/checklist/${this.srl}/edit/?return=1`, {
        content: str,
      });
      this.content = res?.data?.content;
    },
  },
}
</script>

<style src="./checklist-scoped.scss" lang="scss" scoped></style>
<style src="./checklist.scss" lang="scss"></style>
