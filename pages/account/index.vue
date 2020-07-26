<template>
<article>
  <page-header module="users" title="Account"/>

  <field-wrap legend="Basic fields" :hide-legend="true">
    <field>
      <strong slot="label">srl</strong>
      <template slot="body">{{data.srl}}</template>
    </field>
    <field>
      <strong slot="label">E-mail</strong>
      <template slot="body">{{data.email}}</template>
    </field>
    <field>
      <strong slot="label">Name</strong>
      <template slot="body">{{data.name}}</template>
    </field>
    <field>
      <strong slot="label">Admin</strong>
      <template slot="body">{{parseInt(data.admin) === 2 ? 'Yes' : 'No'}}</template>
    </field>
    <field>
      <strong slot="label">Register date</strong>
      <template slot="body">{{getDate(data.regdate)}}</template>
    </field>
  </field-wrap>
  <nav-bottom>
    <template slot="right">
      <button-basic :href="`/users/${srl}/edit/`" color="key" icon-left="edit">Edit</button-basic>
    </template>
  </nav-bottom>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';
import * as fieldset from '~/components/form/fieldset';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'field-wrap': fieldset.wrap,
    'field': fieldset.field,
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
