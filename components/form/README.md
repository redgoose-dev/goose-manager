# form components

## checkbox

..


## content-editable

`<div/>`같은 일반적인 엘리먼트를 이용하여 편집할 수 있습니다.

### usage

```vue
<template>
  <form-content-editable v-model="contentBody"/>
</template>
<script>
  export default {
    components: {
      'form-content-editable': () => import('~/components/form/content-editable'),
    },
    data()
    {
      return {
        contentBody: 'hello world',
      };
    },
  }
</script>
```


## radio

..


## select

..


## text

..
