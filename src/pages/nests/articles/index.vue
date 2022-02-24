<template>
<article>
  <PageHeader
    title="[NAME] Articles"
    description="[NEST_DESCRIPTION]"/>
  <p>TODO: index</p>
  <Controller>
    <template #left>
      <ButtonBasic href="../../" icon-left="cloud">
        Nests
      </ButtonBasic>
      <ButtonBasic href="../categories/" icon-left="server">
        Categories
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        Create article
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import PageHeader from '../../../components/page/header/index.vue';
import Controller from '../../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../../components/button/basic.vue';
import Loading from '../../../components/etc/loading.vue';
import Empty from '../../../components/error/empty.vue';
</script>
