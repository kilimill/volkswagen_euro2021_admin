<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ title }}

  section.title__bar.title__default {{ title }}

  section.data
    .data__content
      ul.tiles
        li.tile(v-if="match")
          .card
            .matches__header
              img.data__countries-img(:src="this.match.country_1.flag") 
              p.matches__header-title {{ this.match.country_1.name }} - {{ this.match.country_2.name }}
              img.data__countries-img(:src="this.match.country_2.flag")

            form.matches__form.form__views(@submit.prevent="editMatch")
              label.matches__form-title Введите дату
                input.matches__form-input.input(
                  name="date",
                  maxlength="16",
                  type="text",
                  v-model="matchesTime",
                  ref="dataMatches",
                  required
                )
              label.matches__form-title Введите счет
                .matches__form-box
                  input.matches__form-goals.input(
                    type="number",
                    min="0",
                    max="100",
                    name="goals_1",
                    v-model="match.goals_1"
                  )
                  input.matches__form-goals.input(
                    type="number",
                    min="0",
                    max="100",
                    name="goals_2",
                    v-model="match.goals_2"
                  )
              label.matches__form-title Комментарий
              textarea.matches__form-textarea.input(
                ref="commente",
                v-model="match.comment"
              )
              label.matches__form-title.card__radio-label Матч закончен
                input.matches__form-checbox.card__checbox(
                  v-model="match.finished",
                  type="checkbox",
                  :checked="match.finished"
                )
                span.matches__form-checboxstyle.card__checboxstyle

              button.card__btn.button_green.matches__form-btn(
                ref="fixBtn",
                :disabled="disBtn"
              ) Изменить
            hr
            footer.card__footer
              button.button.button_red(
                type="button",
                @click.prevent="matchDelete"
              ) Удалить

      .card__loader(v-if="!match")
        span.loader
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";

import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import { validate } from "@/helpers/index";

import Moment from "moment";

export default {
  components: {
    validate,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
  data() {
    return {
      title: "Данные матча",
      match: null,
      matchesTime: null,
      disBtn: false,
    };
  },
  methods: {
    ...mapActions(["setToken", "setUser", "setUsers"]),
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      console.log(error.response.data.message);
    },
    editMatch() {
      this.$refs.fixBtn.innerHTML = "Отправка...";
      const time = Moment(this.matchesTime, "DD/MM/YYYY HH:mm").format(
        "YYYY-MM-DD HH:mm"
      );
      this.disBtn = true;
      axios
        .patch(
          `${URL}/api/match/${this.id}`,
          {
            date: time,
            finished: String(this.match.finished),
            goals_1: +this.match.goals_1,
            goals_2: +this.match.goals_2,
            comment: this.match.comment,
          },
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        )
        .catch((error) => this.errorFun(error))
        .finally(() => {
          this.disBtn = false;
          this.$refs.fixBtn.innerHTML = "Успешно!";
          setTimeout(() => {
            this.$refs.fixBtn.innerHTML = "Изменить";
            this.$router.push("/matches");
          }, 2000);
        });
    },
    getMatch() {
      axios
        .get(`${URL}/api/match/${+this.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.match = data;
        })
        .then(() => {
          this.matchesTime = Moment(this.match.date, "YYYY-MM-DD HH:mm").format(
            "DD/MM/YYYY HH:mm"
          );
        })
        .catch((error) => this.errorFun(error));
    },
    matchDelete() {
      axios
        .delete(`${URL}/api/match/${+this.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.$router.push("/matches");
        })
        .catch((error) => this.errorFun(error));
    },
  },
  mounted() {
    this.getMatch();
  },
};
</script>
