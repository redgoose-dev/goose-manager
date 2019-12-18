<template>
<article class="icons">
  <page-header title="Preview icons" description="아이콘 프리뷰 화면"/>

  <section>
    <svg class="fooo">
      <use xlink:href="/images/txt-logo.svg#svg-logo"/>
    </svg>
  </section>

  <section class="icons-index">
    <h3>index</h3>
<!--    <ul>-->
<!--      <li v-for="item in index">-->
<!--        <div>-->
<!--          <icon :name="item"/>-->
<!--        </div>-->
<!--      </li>-->
<!--    </ul>-->
  </section>

  <section>
    <h3>color</h3>
  </section>
</article>
</template>

<script>
export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    // 'icon': () => import('~/components/icon'),
  },
  data()
  {
    return {
      index: [],
    };
  },
}
</script>

<style lang="scss" >
.icons {
  section {
    h3 {}
  }
  .icons-index {
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
    }
    li {
      border: 1px solid #000;
    }
    svg {
      //width: 50px;
      //height: 50px;
      //stroke-width: 1px;
    }
  }
  .fooo {
    width: 150px;
    height: 50px;
    border: 1px solid red;
    fill: red;
    background: #eee;
    svg {
      width: 24px;
      height: 24px;
      border: 1px solid #000;

    }
    //svg {
    //  width: 100px;
    //  height: 100px;
    //  border: 1px solid #000;
    //}
  }
}
</style>
