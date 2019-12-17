<template>
<article>
  <page-header module="users" title="Account"/>
  <div class="rg-index-items">
    <dl>
      <dt>srl number</dt>
      <dd>{{data.srl}}</dd>
    </dl>
    <dl>
      <dt>E-mail</dt>
      <dd>{{data.email}}</dd>
    </dl>
    <dl>
      <dt>Name</dt>
      <dd>{{data.name}}</dd>
    </dl>
    <dl>
      <dt>Admin</dt>
      <dd>{{parseInt(data.admin) === 2 ? 'Yes' : 'No'}}</dd>
    </dl>
    <dl>
      <dt>Register date</dt>
      <dd>{{getDate(data.regdate)}}</dd>
    </dl>
  </div>
  <nav-bottom>
    <template slot="right">
      <button-basic label="Edit" :to="`/users/${srl}/edit/`" color="key"/>
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
  async asyncData(cox)
  {
    try
    {
      // check user srl
      if (!cox.store.state.authUser.srl) throw messages.msg.notLogin;
      // get data
      const srl = parseInt(cox.store.state.authUser.srl);
      let res = await cox.$axios.$get(`/users/${srl}/`);
      if (!res.success) throw res.message;
      return {
        srl,
        data: res.data,
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
  methods: {
    getDate(date)
    {
      return dates.getFormatDate(date, true);
    },
  },
}
</script>