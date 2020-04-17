export default [
  // articles
  {
    "name": "articles-index",
    "path": "/articles/",
    "component": "pages-extend/articles/index.vue"
  },
  {
    "name": "articles-item",
    "path": "/articles/:article/",
    "component": "pages-extend/articles/:srl/index.vue"
  },
  {
    "name": "articles-edit",
    "path": "/articles/:article/edit/",
    "component": "pages-extend/articles/:srl/edit.vue"
  },
  {
    "name": "articles-change-nest",
    "path": "/articles/:article/change-nest/",
    "component": "pages-extend/articles/:srl/change-nest.vue"
  },
  {
    "name": "articles-delete",
    "path": "/articles/:article/delete/",
    "component": "pages-extend/articles/:srl/delete.vue"
  },

  // nests
  {
    "name": "nests-index",
    "path": "/nests/",
    "component": "pages-extend/nests/index.vue"
  },
  {
    "name": "nests-add",
    "path": "/nests/add/",
    "component": "pages-extend/nests/add.vue"
  },
  {
    "name": "nests-edit",
    "path": "/nests/:nest/edit/",
    "component": "pages-extend/nests/:nest/edit.vue"
  },
  {
    "name": "nests-delete",
    "path": "/nests/:nest/delete/",
    "component": "pages-extend/nests/:nest/delete.vue"
  },
  // nests-articles
  {
    "name": "nests-articles-index",
    "path": "/nests/:nest/articles/",
    "component": "pages-extend/articles/:nest/index.vue"
  },
  {
    "name": "nests-articles-add",
    "path": "/nests/:nest/articles/add/",
    "component": "pages-extend/articles/:nest/add.vue"
  },
  {
    "name": "nests-articles-item",
    "path": "/nests/:nest/articles/:article/",
    "component": "pages-extend/articles/:srl/index.vue"
  },
  {
    "name": "nests-articles-edit",
    "path": "/nests/:nest/articles/:article/edit/",
    "component": "pages-extend/articles/:srl/edit.vue"
  },
  {
    "name": "nests-articles-change-nest",
    "path": "/nests/:nest/articles/:article/change-nest/",
    "component": "pages-extend/articles/:srl/change-nest.vue"
  },
  {
    "name": "nests-articles-delete",
    "path": "/nests/:nest/articles/:article/delete/",
    "component": "pages-extend/articles/:srl/delete.vue"
  },
  // nests-categories
  {
    "name": "nests-categories-index",
    "path": "/nests/:nest/categories/",
    "component": "pages-extend/categories/:nest/index.vue"
  },
  {
    "name": "nests-categories-add",
    "path": "/nests/:nest/categories/add/",
    "component": "pages-extend/categories/:nest/add.vue"
  },
  {
    "name": "nests-categories-edit",
    "path": "/nests/:nest/categories/:category/edit/",
    "component": "pages-extend/categories/:srl/edit.vue"
  },
  {
    "name": "nests-categories-delete",
    "path": "/nests/:nest/categories/:category/delete/",
    "component": "pages-extend/categories/:srl/delete.vue"
  },

  // categories
  {
    "name": "categories-index",
    "path": "/categories/:nest/",
    "component": "pages-extend/categories/:nest/index.vue"
  },
  {
    "name": "categories-add",
    "path": "/categories/:nest/add",
    "component": "pages-extend/categories/:nest/add.vue"
  },
  {
    "name": "categories-edit",
    "path": "/categories/:srl/edit",
    "component": "pages-extend/categories/:srl/edit.vue"
  },
  {
    "name": "categories-delete",
    "path": "/categories/:srl/delete",
    "component": "pages-extend/categories/:srl/delete.vue"
  },
]
