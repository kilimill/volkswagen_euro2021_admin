<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ title }}

  section.mathes.title__default
    p.title__bar {{ title }}
    .table__footer
      .table__footer-control
        button.button.button_green.button_href(
          type="button",
          @click.prevent="reloadMatсhes"
        ) Обновить список

  section.mathes
    form.matches__form.form__views(
      @submit.prevent="submitMatch",
      ref="matchForm",
      @change="valForm"
    )
      .matches__form__inner
        .matches__form-content
          label.matches__form-title Введите дату
            input.matches__form-input.input(
              placeholder="DD.MM.YYYY HH:MM",
              name="date",
              maxlength="16",
              type="text",
              v-model="matchesTime",
              @input="valDate",
              ref="dataMatches"
            )
          label.matches__form-title.matches__form-country Выберите страну 1
            select.matches__form-input.input(
              name="country_1",
              v-model="getIdCountry_1"
            )
              option(
                v-for="item in this.countriesGet",
                :key="item.id",
                :value="item.id"
              ) {{ item.name }}
          label.matches__form-title.matches__form-country Выберите страну 2
            select.matches__form-input.input(
              name="country_2",
              v-model="getIdCountry_2"
            )
              option(
                v-for="item in this.countriesGet",
                :key="item.id",
                :value="item.id"
              ) {{ item.name }}
        .matches__form-content
          label.matches__form-title Комментарий
            textarea.matches__form-textarea.input(ref="comment")
          label.matches__form-title Введите счет
            .matches__form-box
              input.matches__form-goals.input(
                type="number",
                min="0",
                max="100",
                name="goals_1",
                ref="selectMath1"
              )
              input.matches__form-goals.input(
                type="number",
                min="0",
                max="100",
                name="goals_2",
                ref="selectMath2"
              )
      label.matches__form-title.card__radio-label Матч закончен
        input.matches__form-checbox.card__checbox(
          @change="finishMatchCheck",
          type="checkbox"
        )
        span.card__checboxstyle

      button.matches__form-btn.btn--add(:disabled="disBtn") Добавить матчи +

  section.data
    .data__content
      .table__wrapper
        div(v-if="elemsOfPage.length")
          header.card__header
            p.card__header-title
              span.card__header-icon
                i.mdi.mdi-gamepad.default
              span Список матчей
            select.data__select(v-model="listMatches", @change="getListMathes")
              option(value="all") Все матчи
              option(value="future") Предстоящие матчи
              option(value="finished") Прошедшие матчи

          .table__scroll
            table.table
              thead
                th Страны
                th Счет
                th Дата
                th Матч завершен
                th.controls &nbsp;
              tbody
                tr(v-for="item in elemsOfPage", :key="item.id")
                  td.tbody__window
                    img.data__countries-img(:src="item.country_1.flag") 
                    p {{ item.country_1.name }} - {{ item.country_2.name }}
                    img.data__countries-img(:src="item.country_2.flag")
                  td {{ item.finished ? `${item.goals_1}:${item.goals_2}` : '-' }}
                  td 
                    time {{ item.date.slice(0, -1) | moment('LLL') }}
                  td {{ item.finished ? 'Да' : 'Нет' }}
                  td 
                    <router-link :to="`/matches/${item.id}`" class="button button_green table__profile">
                      span.icon.is-small
                        i.mdi.mdi-account-edit
                    </router-link>
                    <button type="button" class="button button_red table__profile" @click.prevent="matchesDelete(item.id)">
                      span.icon.is-small
                        i.mdi.mdi-trash-can
                    </button>
          .card__pagination-wrapper(v-if="totalPages > 1")
            sliding-pagination(
              :current="currentPage",
              :total="totalPages",
              @page-change="pageChangeHandler"
            ) 
        p.data__content-empty(v-else) Нет матчей

        .table__footer
          .table__footer-control
            button.button.button_green.button_href(
              type="button",
              @click.prevent="reloadMatсhes"
            ) Обновить матчи
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";

import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

import SlidingPagination from "vue-sliding-pagination";
import Moment from "moment";
import { validate } from "@/helpers/index";

export default {
  components: {
    SlidingPagination,
    Moment,
    validate,
  },
  computed: {
    ...mapGetters(["getUsers", "getToken", "getMatches"]),
    elemsOfPage() {
      let elems = this.getMatches.slice(0);
      return elems.splice(
        (this.currentPage - 1) * this.elemsPerPage,
        this.elemsPerPage
      );
    },
    totalPages() {
      let elems = this.getMatches.slice(0);
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
    valForm() {
      if (
        this.$refs.dataMatches.value.length == 16 &&
        this.getIdCountry_1 !== null &&
        this.getIdCountry_2 !== null
      ) {
        this.disBtn = false;
      }
    },
    valDate() {
      const elm = this.$refs.dataMatches;
      validate(elm);
    },
    ...mapMutations(["setMatches"]),
    finishMatchCheck(e) {
      if (e.target.checked) {
        this.finishMatch = "true";
      } else {
        this.finishMatch = "false";
      }
    },
    getListMathes() {
      axios
        .get(`${URL}/api/match/state/${this.listMatches}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.setMatches(data);
        })
        .catch((error) => this.errorFun(error));
    },
    submitMatch() {
      this.disBtn = true;
      let time = Moment(this.matchesTime, "DD/MM/YYYY HH:mm").format(
        "YYYY-MM-DD HH:mm"
      );
      axios({
        method: "POST",
        url: `${URL}/api/match`,
        data: {
          date: time,
          finished: this.finishMatch,
          country_1: this.getIdCountry_1,
          country_2: this.getIdCountry_2,
          goals_1: +this.$refs.selectMath1.value,
          goals_2: +this.$refs.selectMath2.value,
          comment: this.$refs.comment.value,
        },
        headers: {
          Authorization: `Bearer ${this.getToken}`,
        },
      })
        .catch((error) => this.errorFun(error))
        .finally(() => {
          this.reloadMatсhes();
          setTimeout(() => {
            this.$refs.comment.value = "";
            this.matchesTime = "";
            this.getIdCountry_1 = "";
            this.getIdCountry_2 = "";
            this.$refs.selectMath1.value = "";
            this.$refs.selectMath2.value = "";
          }, 300);
        });
    },

    pageChangeHandler(selectedPage) {
      this.currentPage = selectedPage;
    },
    reloadMatсhes() {
      axios
        .get(`${URL}/api/match/state/all`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.setMatches(data);
        })
        .catch((error) => this.errorFun(error));
    },
    getCountry() {
      axios
        .get(`${URL}/api/country`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.countriesGet = data;
        })
        .catch((error) => this.errorFun(error));
    },
    matchesDelete(id) {
      axios
        .delete(`${URL}/api/match/${+id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.reloadMatсhes();
        })
        .catch((error) => {
          this.errorFun(error);
        });
    },
  },
  mounted() {
    this.getCountry();
    this.reloadMatсhes();
  },
  data() {
    return {
      title: "Матчи",

      currentPage: 1,
      elemsPerPage: 15,

      matchesTime: null,
      finishMatch: "false",
      countriesGet: null,
      getIdCountry_1: null,
      getIdCountry_2: null,
      listMatches: "all",
      disBtn: true,
    };
  },
};
</script>
