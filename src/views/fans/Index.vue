<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ title }}

  section.fans.title__block
    .fans__top
      p.title__bar {{ title }}
    .fans__bottom
      .country__form.form__views
        input.country__form-input.input(
          placeholder="Введите email",
          name="email",
          v-model.lazy='email'
        )
      .table__footer
        .table__footer-control.table__footer-control_buttons
          button.button.button_blue.button__post(
            type="button",
            @click="fansSendStars",
            :disabled="disForm"
          ) Рассылка звездам
          .table__footer-control-buttons
            button.button.button_blue.button__post(
              type="button",
              @click="fansSendActivePost",
              :disabled="disForm"
            ) Отослать подтвержденным
            button.button.button_blue.button__post(
              type="button",
              @click="fansModerationPost",
              :disabled="disForm"
            ) Отослать напоминание повторно
          button.button.button_green.button_href(
            type="button",
            @click.prevent="reloadFansList"
          ) Обновить список

  section.data.fans
    .data__content
      .table__wrapper
        div(v-if="elemsOfPage.length")
          header.card__header.fans__header
            p.card__header-title
              span.card__header-icon
                i.mdi.mdi-account-group.default
              span Список фанатов
            select.data__select(v-model="listFans", @change="filteredFans")
              option(value="all") Все фанаты
              option(value="MODERATION") На модерации
              option(value="APPROVED") Одобренные
            <json-excel class='fans__download-btn' :data="users" name="users-list.csv" type="csv" :escapeCsv='false'>
              button.button.button_green.button_href(type="button") Скачать список юзеров
            </json-excel>
          .table__scroll
            table.table
              thead
                th Аватарка
                th Имя и фамилия
                th Email
                th Пол
                th Ранг
                th.controls &nbsp;
              tbody
                tr(v-for="item in elemsOfPage", :key="item.id")
                  td
                    img.data__countries-img(:src="item.avatar")
                  td {{ item.name }} {{ item.surname }}
                  td {{ item.email }}
                  td {{ item.gender }}
                  td {{ item.rank }}
                  td
                    <router-link :to="`/fans/${item.id}`" class="button button_green table__profile">
                      span.icon.is-small
                        i.mdi.mdi-account-edit
                    </router-link>
                    <button type="button" class="button button_red table__profile" @click.prevent="fansDelete(item.id)">
                      span.icon.is-small
                        i.mdi.mdi-trash-can
                    </button>

          .card__pagination-wrapper(v-if="totalPages > 1")
            sliding-pagination(
              :current="currentPage",
              :total="totalPages",
              @page-change="pageChangeHandler"
            )

        p.data__content-empty(v-else) Нет зарегистрированных фанатов

        .table__footer
          .table__footer-control
            button.button.button_green.button_href(
              type="button",
              @click.prevent="reloadFansList"
            ) Обновить список
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";

import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import Moment from "moment";
import SlidingPagination from "vue-sliding-pagination";
import JsonExcel from "vue-json-excel";
export default {
  components: {
    SlidingPagination,
    JsonExcel,
    Moment,
  },
  computed: {
    ...mapGetters(["getUsers", "getToken"]),
    elemsOfPage() {
      if (this.email == '') {
        let elems = this.filteredFans().slice(0);
        return elems.splice(
          (this.currentPage - 1) * this.elemsPerPage,
          this.elemsPerPage
        );
      } else {
        return this.filteredFans().filter(x => x.email === this.email);
      }
    },
    totalPages() {
      if (this.email == '') {
        let elems = this.filteredFans().slice(0);
        return Math.ceil(elems.length / this.elemsPerPage);
      }
    },
  },
  watch: {
    email() {
      this.email = this.email.replace(/\s/g, '');
    }
  },
  methods: {
    findUser() {
      console.log(this.fans.filter(x => x.email === this.email))
    },
    usersEdit() {
      this.users.forEach((item) => {
        item.phrase1 = "";
        item.phrase2 = "";
        item.phrase3 = "";
        item.phrases.forEach((el, i) => {
          if (item.phrases.length != 0) {
            item["phrase" + (i + 1)] = el.text;
          }
        });
        if (item.rank) item.rank = item.rank.name;
        delete item.token;
        delete item.createdAt;
        delete item.password;
        delete item.phrases;
      });
    },
    fansSendStars() {
      this.disForm = true;
      axios
        .post(
          `${URL}/api/fan/send_rank`,
          {},
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        )
        .catch((error) => this.errorFun(error))
        .finally(() => {
          setTimeout(() => {
            this.disForm = false;
          }, 3000);
        });
    },
    filteredFans() {
      return this.fans.filter(
        (item) =>
          item.status.toUpperCase() === this.listFans || this.listFans === "all"
      );
    },
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      console.log(error.response.data.message);
    },
    fansModerationPost() {
      this.disForm = true;
      axios
        .post(
          `${URL}/api/fan/send_confirm`,
          {},
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        )
        .catch((error) => this.errorFun(error))
        .finally(() => {
          setTimeout(() => {
            this.disForm = false;
          }, 3000);
        });
    },
    fansSendActivePost() {
      this.disForm = true;
      axios
        .post(
          `${URL}/api/fan/send_active`,
          {},
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        )
        .catch((error) => this.errorFun(error))
        .finally(() => {
          setTimeout(() => {
            this.disForm = false;
          }, 3000);
        });
    },
    ...mapActions(["setToken", "setUser", "setUsers"]),
    reloadFansList() {
      axios
        .get(`${URL}/api/fan`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.fans = data;
          this.users = data;
          this.usersEdit();
        })
        .catch((error) => this.errorFun(error));
    },
    pageChangeHandler(selectedPage) {
      this.currentPage = selectedPage;
    },
    fansDelete(id) {
      axios
        .delete(`${URL}/api/fan/${+id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.reloadFansList();
        })
        .catch((error) => {
          this.errorFun(error);
        });
    },
  },
  mounted() {
    this.reloadFansList();
  },
  data() {
    return {
      title: "Фанаты",

      currentPage: 1,
      elemsPerPage: 30,

      disForm: false,
      listFans: "all",
      fans: [],
      users: [],
      phrases: [],
      email: '',
    };
  },
};
</script>
