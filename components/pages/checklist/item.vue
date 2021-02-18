<template>
<article class="checklist-item">
  <h3 class="checklist-item__date">{{computedDate}}</h3>
  <div ref="body" class="redgoose-body redgoose-body--dark checklist-item__body"/>
</article>
</template>

<script>
import marked from 'marked';
import { convertDateFormat, replaceMark } from './src';

export default {
  name: 'checklist-item',
  components: {},
  props: {
    srl: { type: Number },
    content: { type: String },
    regdate: { type: String },
    currentDate: { type: Boolean, default: false },
  },
  model: {
    prop: 'content',
    event: 'update',
  },
  computed: {
    computedDate()
    {
      const { preference } = this.$store.state;
      const regdate = this.regdate.split('-').map(o => Number(o));
      return convertDateFormat(new Date(regdate[0], regdate[1]-1, regdate[2]), preference.checklist.format);
    },
  },
  mounted()
  {
    this.$body = this.$refs['body'];
    this.processingEditContent = false;
    this.setupContent();
  },
  methods: {
    async setupContent()
    {
      const onChangeCheckbox = e => {
        const index = Number(e.target.dataset?.index);
        const checkMark = e.target.checked ? 'x' : ' ';
        let body = replaceMark(this.content, /\- \[[x|\s]\]/gmi, `- [${checkMark}]`, index + 1);
        this.updateContent(body);
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
        if (this.currentDate)
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
    async updateContent(str)
    {
      this.$emit('update', str);
      if (this.processingEditContent) return;
      this.processingEditContent = true;
      await this.$axios.$post(`/checklist/${this.srl}/edit/`, { content: str });
      this.processingEditContent = false;
    },
  },
};
</script>

<style src="./item.scss" lang="scss"></style>
<style src="./item-scoped.scss" lang="scss" scoped></style>
