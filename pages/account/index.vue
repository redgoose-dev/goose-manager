<template>
<article>
  <page-header module="users" title="Account"/>

  <div class="rg-form-fieldset">
    <dl class="rg-form-field">
      <dt><strong>srl</strong></dt>
      <dd>
        <p>{{data.srl}}</p>
      </dd>
    </dl>
    <dl class="rg-form-field">
      <dt><strong>E-mail</strong></dt>
      <dd>
        <p>{{data.email}}</p>
      </dd>
    </dl>
    <dl class="rg-form-field">
      <dt><strong>Name</strong></dt>
      <dd>
        <p>{{data.name}}</p>
      </dd>
    </dl>
    <dl class="rg-form-field">
      <dt><strong>Admin</strong></dt>
      <dd>
        <p>{{parseInt(data.admin) === 2 ? 'Yes' : 'No'}}</p>
      </dd>
    </dl>
    <dl class="rg-form-field">
      <dt><strong>Register date</strong></dt>
      <dd>
        <p>{{getDate(data.regdate)}}</p>
      </dd>
    </dl>
  </div>
  <nav-bottom>
    <template slot="right">
      <button-basic label="Edit" :to="`/users/${srl}/edit/`" color="key" icon-left="edit"/>
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
