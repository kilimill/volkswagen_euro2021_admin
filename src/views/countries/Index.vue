<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ title }}

  section.country.title__default
    p.title__bar {{ title }}
    .table__footer
      .table__footer-control
        button.button.button_green.button_href(
          type="button",
          @click.prevent="reloadCountries"
        ) Обновить список

  section.country
    form.country__form.form__views(
      @submit.prevent="submitForm",
      ref="forma",
      @change="validation"
    )
      input.country__form-input.input(
        placeholder="Введите страну",
        name="name",
        ref="inputCountry",
        required
      )
      input.country__form-input.input(
        placeholder="Введите код страны",
        name="code",
        ref="inputCode",
        required
      )
      .country__form-wrapper
        span.country__form-preview(ref="preview")
        label.country__form-button
          input.country__form-file(
            type="file",
            name="flag",
            accept="image/png,image/jpeg",
            @change="prev($event, '.country__form-preview', 'country__form-img')",
            ref="file"
          )
          span.input__file-icon-wrapper
          span.input__file-button-text Выберите файл

      button.country__form-btn.btn--add(:disabled="disForm") Добавить страну +

  section.data
    .data__content
      .table__wrapper
        div(v-if="elemsOfPage.length")
          header.card__header
            p.card__header-title
              span.card__header-icon
                i.mdi.mdi.mdi-flag.default
              span Список стран
          .table__scroll
            table.table
              thead
                th Страна
                th Код страны
                th Флаг
                th.controls &nbsp;
              tbody
                tr(v-for="item in elemsOfPage", :key="item.id")
                  td {{ item.name }}
                  td {{ item.code }}
                  td 
                    img.data__countries-img(:src="item.flag")
                  td
                    <router-link :to="`/contries/${item.id}`" class="button button_green table__profile">
                      span.icon.is-small
                        i.mdi.mdi-account-edit
                    </router-link>
                    <button type="button" class="button button_red table__profile" @click.prevent="countryDelete(item.id)">
                      span.icon.is-small
                        i.mdi.mdi-trash-can
                    </button>
          .card__pagination-wrapper(v-if="totalPages > 1")
            sliding-pagination(:current="currentPage" :total="totalPages" @page-change="pageChangeHandler")

        p.data__content-empty(v-else) Нет зарегистрированных стран

        .table__footer
          .table__footer-control
            button.button.button_green.button_href(
              type="button",
              @click.prevent="reloadCountries"
            ) Обновить страны
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
    ...mapGetters(["getToken"]),
    elemsOfPage() {
      let elems = this.countries.slice(0);
      return elems.splice(
        (this.currentPage - 1) * this.elemsPerPage,
        this.elemsPerPage
      );
    },
    totalPages() {
      let elems = this.countries.slice(0);
      return Math.ceil(elems.length / this.elemsPerPage);
    },
  },
  methods: {
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      console.log(error.response.data.message);
    },
    prev(e, qsClass, imgClass) {
      ppreview(e, qsClass, imgClass);
      this.validation();
    },
    validation() {
      if (
        this.$refs.file.value !== "" &&
        this.$refs.inputCountry.value !== "" &&
        this.$refs.inputCode.value !== ""
      ) {
        this.disForm = false;
      }
    },
    ...mapActions(["setToken", "setUser", "setUsers"]),
    submitForm() {
      let formData = new FormData(this.$refs.forma);
      axios({
        method: "POST",
        url: `${URL}/api/country`,
        data: formData,
        headers: {
          Authorization: `Bearer ${this.getToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .catch((error) => {
          this.errorFun(error);
        })
        .finally(() => {
          this.$refs.forma.reset();
          this.reloadCountries();
          this.disForm = true;
          this.$refs.preview.innerHTML = "";
        });
    },
    reloadCountries() {
      axios
        .get(`${URL}/api/country`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.countries = data;
        })
        .catch((error) => {
          this.errorFun(error);
        })
    },
    countryDelete(id) {
      axios
        .delete(`${URL}/api/country/${+id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.reloadCountries();
        })
        .catch((error) => {
          this.errorFun(error);
        });
    },
    pageChangeHandler(selectedPage) {
      this.currentPage = selectedPage;
    },
  },
  mounted() {
    this.reloadCountries();
  },
  data() {
    return {
      title: "Страны",

      currentPage: 1,
      elemsPerPage: 15,

      disForm: true,
      countries: [],
    };
  },
};
</script>
