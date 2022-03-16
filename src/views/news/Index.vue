<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ title }}

  section.news.title__default
    p.title__bar {{ title }}
    .table__footer
      .table__footer-control
        button.button.button_green.button_href(
          type="button",
          @click.prevent="reloadNews"
        ) Обновить список

  section.news
    form.news__form.form__views(
      @submit.prevent="submitNews",
      ref="newsForm",
      @change="validation"
    )
      label.news__form-title.label-title Введите заголовок
        input.news__form-input.input(
          name="title",
          v-model="newNews.title",
          ref="titleNews"
        )
      label.news__form-title.label-title Введите url
        input.news__form-input.input(
          name="url",
          v-model="newNews.url",
          ref="urlNews"
        )
      label.news__form-title.label-title Выберите тип
        select.news__form-input.input(name="type", v-model="newNews.type")
          option(value="ROADSHOW") ROADSHOW
          option(value="PARTNER") PARTNER
          option(value="VWNEWS") VWNEWS

      .country__form-wrapper
        span.country__form-preview(ref="preview")
        label.country__form-button
          input.country__form-file(
            type="file",
            name="img",
            accept="image/jpg, image/jpeg, image/png, image/gif, image/svg",
            @change="prev($event, '.country__form-preview', 'country__form-img')",
            ref="file"
          )
          span.input__file-icon-wrapper
          span.input__file-button-text Выберите файл

      button.news__form-btn.btn--add(:disabled="disBtn") Добавить новость +

  section.data
    .data__content
      .table__wrapper
        div(v-if="elemsOfPage.length")
          header.card__header
            p.card__header-title
              span.card__header-icon
                i.mdi.mdi-newspaper.default
              span Список новостей
          .table__scroll
            table.table
              thead
                th Обложка
                th Заголовок
                th(columns="2") Время публикации
                th Тип
                th Опубликовано
                th.controls &nbsp;
              tbody
                tr(v-for="item in elemsOfPage", :key="item.id")
                  td
                    img.data__countries-img(:src="item.img")
                  td
                    a(:href="`/news/${item.id}`", target="blank") {{ item.title }}
                  td {{ item.createdAt.slice(0, -1) | moment('LLL') }}
                  td {{ item.type }}
                  td {{ item.status == 'PUBLISHED' ? 'Да' : 'Нет' }}
                  td
                    <router-link :to="`/news/${item.id}`" class="button button_green table__profile">
                      span.icon.is-small
                        i.mdi.mdi-account-edit
                    </router-link>
                    <button type="button" class="button button_red table__profile" @click.prevent="countryDelete(item.id)">
                      span.icon.is-small
                        i.mdi.mdi-trash-can
                    </button>

          .card__pagination-wrapper(v-if="totalPages > 1")
            sliding-pagination(
              :current="currentPage",
              :total="totalPages",
              @page-change="pageChangeHandler"
            )

        p.data__content-empty(v-else) Нет новостей

        .table__footer
          .table__footer-control
            button.button.button_green.button_href(
              type="button",
              @click.prevent="reloadNews"
            ) Обновить список
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";

import { mapGetters } from "vuex";
import { mapActions } from "vuex";

import { ppreview } from "@/helpers/index";
import SlidingPagination from "vue-sliding-pagination";

export default {
  components: {
    SlidingPagination,
    ppreview,
  },
  computed: {
    ...mapGetters(["getUsers", "getToken"]),
    elemsOfPage() {
      let elems = this.news.slice(0);
      return elems.splice(
        (this.currentPage - 1) * this.elemsPerPage,
        this.elemsPerPage
      );
    },
    totalPages() {
      let elems = this.news.slice(0);
      return Math.ceil(elems.length / this.elemsPerPage);
    },
  },
  methods: {
    validation() {
      if (
        this.newNews.title !== "" &&
        this.newNews.url !== "" &&
        this.newNews.type !== "" &&
        this.$refs.file.value !== ""
      ) {
        this.disBtn = false;
      } else {
        this.disBtn = true;
      }
    },
    prev(e, qsClass, imgClass) {
      ppreview(e, qsClass, imgClass);
    },
    submitNews() {
      this.disBtn = true;
      let formData = new FormData(this.$refs.newsForm);
      axios({
        method: "POST",
        url: `${URL}/api/news`,
        data: formData,
        headers: {
          Authorization: `Bearer ${this.getToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .catch((error) => this.errorFun(error))
        .finally(() => {
          this.reloadNews();
          this.newNews.title = "";
          this.newNews.url = "";
          this.newNews.type = "";
          this.$refs.preview.innerHTML = "";
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
    reloadNews() {
      axios
        .get(`${URL}/api/news`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.news = data;
          this.news.forEach(item => {
            if(item.title.length > 30) {
              item.title = `${item.title.substring(0, 30)}...`
            }
          });
        })
        .catch((error) => this.errorFun(error));
    },
    pageChangeHandler(selectedPage) {
      this.currentPage = selectedPage;
    },
    countryDelete(id) {
      axios
        .delete(`${URL}/api/news/${+id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.reloadNews();
        })
        .catch((error) => {
          this.errorFun(error);
        });
    },
  },
  mounted() {
    this.reloadNews();
  },
  data() {
    return {
      title: "Новости",
      news: [],
      disBtn: true,
      currentPage: 1,
      elemsPerPage: 30,
      newNews: {
        title: "",
        url: "",
        type: "",
        img: "",
      },
    };
  },
};
</script>