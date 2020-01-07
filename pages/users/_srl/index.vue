<template>
<article>
  <page-header module="users" title="Users / Detail"/>

  <field-wrap legend="Basic field" tag="div" :hide-legend="true">
    <field>
      <strong slot="label">srl</strong>
      <div><strong>{{data.srl}}</strong></div>
    </field>
    <field>
      <strong slot="label">E-mail</strong>
      <div>{{data.email}}</div>
    </field>
    <field>
      <strong slot="label">Name</strong>
      <div>{{data.name}}</div>
    </field>
    <field>
      <strong slot="label">Admin</strong>
      <div>{{parseInt(data.admin) === 2 ? 'Yes' : 'No'}}</div>
    </field>
    <field>
      <strong slot="label">Register date</strong>
      <div>{{getDate(data.regdate)}}</div>
    </field>
  </field-wrap>

  <nav-bottom>
    <template slot="left">
      <button-basic to="../" icon-left="list">Index</button-basic>
    </template>
    <template slot="right">
      <button-basic to="./edit/" color="gray" icon-left="edit">Edit</button-basic>
      <button-basic to="./delete/" color="key" icon-left="trash">Delete</button-basic>
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
    }
  }
}
</script>
