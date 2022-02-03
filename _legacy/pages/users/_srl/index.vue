<template>
<article>
  <page-header module="users" title="Users / Detail"/>

  <field-wrap legend="Basic field" tag="div" :hide-legend="true">
    <field>
      <strong slot="label">srl</strong>
      <template slot="body"><strong>{{user.srl}}</strong></template>
    </field>
    <field>
      <strong slot="label">E-mail</strong>
      <template slot="body">{{user.email}}</template>
    </field>
    <field>
      <strong slot="label">Name</strong>
      <template slot="body">{{user.name}}</template>
    </field>
    <field>
      <strong slot="label">Admin</strong>
      <template slot="body">{{parseInt(user.admin) === 1 ? 'Yes' : 'No'}}</template>
    </field>
    <field>
      <strong slot="label">Register date</strong>
      <template slot="body">{{getDate(user.regdate)}}</template>
    </field>
  </field-wrap>

  <nav-bottom>
    <template slot="left">
      <button-basic href="../" icon-left="list">Index</button-basic>
    </template>
    <template slot="right">
      <button-basic href="./edit/" color="gray" icon-left="edit">Edit</button-basic>
      <button-basic href="./delete/" color="key" icon-left="trash">Delete</button-basic>
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
  validate(cox)
  {
    return cox.params.srl && /^\d+$/.test(cox.params.srl);
  },
  async asyncData(cox)
  {
    try
    {
      const srl = parseInt(cox.params.srl);
      let res = await cox.$axios.$get(`/users/${srl}/`);
      if (!res.success) throw res.message;
      return {
        srl,
        user: res.data,
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
    }
  }
}
</script>
