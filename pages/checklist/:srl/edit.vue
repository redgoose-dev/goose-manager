<template>
<article>
  <page-header module="articles" title="Checklist / Edit item"/>
  <form @submit.prevent="onSubmit">
    <form-content-editable v-model="form.content"/>
    <hr>
    <pre>{{form}}</pre>
    <hr>
    <textarea v-model="form.content" rows="10" cols="100"></textarea>
    <hr>
    <hr>
    <p>/checklist/:srl/edit/</p>
    <nav>
      <button type="submit">Submit</button>
    </nav>
  </form>
</article>
</template>

<script>
export default {
  name: 'checklist-edit-item',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'form-content-editable': () => import('~/components/form/content-editable'),
  },
  async asyncData(context)
  {
    const { store, $axios } = context;
    const { preference } = store.state;
    return {
      form: {
        srl: 0,
        regdate: '0000-00-00',
        content: 'hello',
      },
    };
  },
  methods: {
    onSubmit()
    {
      console.log('call onSubmit()');
      // this.$router.push('/checklist/');
    },
  },
}
</script>
