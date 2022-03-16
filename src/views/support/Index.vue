<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ title }}

  section.support.title__default
    p.title__bar {{ title }}
    .table__footer
      .table__footer-control
        button.button.button_green.button_href(
          type="button",
          @click.prevent="getPhraseList"
        ) Обновить список

  section.data
    .data__content
      .table__wrapper
        div(v-if="elemsOfPage.length")
          header.card__header
            p.card__header-title
              span.card__header-icon
                i.mdi.mdi-file.default
              span Список фраз
          .table__scroll
            table.table
              thead
                th Слова поддержки
                th Статус
                th Модерация
              tbody
                tr(v-for="item in elemsOfPage", :key="item.id")
                  td {{ item.text }}
                  td {{ item.status }}
                  td 
                    .card__footer_rejected(v-if="item.status == 'UNPUBLISHED'")
                      button.button.button_blue(
                        type="button",
                        @click.prevent="arrStatusChange('PUBLISHED', item.id)",
                        v-if="item.status == 'UNPUBLISHED'"
                      ) Опубликовать
                    .card__footer_rejected(v-else)
                      button.button.button_blue(
                        type="button",
                        @click.prevent="arrStatusChange('UNPUBLISHED', item.id)",
                        v-if="item.status == 'PUBLISHED'"
                      ) Снять с публикации

          .card__pagination-wrapper(v-if="totalPages > 1")
            sliding-pagination(
              :current="currentPage",
              :total="totalPages",
              @page-change="pageChangeHandler"
            )

        p.data__content-empty(v-else) Нет фраз для модерации

        .table__footer
          .table__footer-control
            button.button.button_green.button_href(
              type="button",
              @click.prevent="getPhraseList"
            ) Обновить список
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";

import { mapGetters } from "vuex";
import { mapActions } from "vuex";

import SlidingPagination from "vue-sliding-pagination";

export default {
  components: {
    SlidingPagination,
  },
  computed: {
    ...mapGetters(["getUsers", "getToken"]),
    elemsOfPage() {
      let elems = this.phrase.slice(0);
      return elems.splice(
        (this.currentPage - 1) * this.elemsPerPage,
        this.elemsPerPage
      );
    },
    totalPages() {
      let elems = this.phrase.slice(0);
      return Math.ceil(elems.length / this.elemsPerPage);
    },
  },
  methods: {
    arrStatusChange(state, id) {
      axios
        .patch(
          `${URL}/api/phrase/${+id}/status`,
          {
            status: state,
          },
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        )
        .catch((error) => this.errorFun(error))
        .finally(() => {
          this.getPhraseList();
        });
    },
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      console.log(error.response.data.message);
    },
    ...mapActions(["setToken", "setUser", "setUsers"]),
    getPhraseList() {
      axios
        .get(`${URL}/api/phrase`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.phrase = data;
        })
        .catch((error) => this.errorFun(error));
    },
    postPhrase() {
      axios
        .post(
          `${URL}/api/phrase`,
          {
            token: this.getToken,
            text: текст,
          },
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        )
        .then(({ data }) => {
          this.phrase = data;
        })
        .catch((error) => this.errorFun(error));
    },
    pageChangeHandler(selectedPage) {
      this.currentPage = selectedPage;
    },
  },
  mounted() {
    this.getPhraseList();
  },
  data() {
    return {
      title: "Поддержка",

      currentPage: 1,
      elemsPerPage: 30,

      phrase: [],
    };
  },
};
</script>
