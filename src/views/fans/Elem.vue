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
        li.tile(v-if="fan")
          .card
            .card__content
              .card__ava(v-if="fan.avatar")
                img.card__ava-img(:src="fan.avatar")
                button.button.button_red(
                  type="button",
                  @click.prevent="fanAvaDelete"
                ) Удалить аватарку
              form.card__form
                .card__field
                  label.card__label Имя
                  input.card__control(
                    v-model="fan.name",
                    name="name",
                    required
                  )
                .card__field
                  label.card__label Фамилия
                  input.card__control(
                    v-model="fan.surname",
                    name="surname",
                    required
                  )
                .card__field
                  label.card__label Email
                  input.card__control(
                    v-model="fan.email",
                    name="email",
                    required
                  )
                .card__radio
                  label.c.card__radio-label М
                    input.card__radio-input(
                      type="radio",
                      name="gender",
                      v-model="fan.gender",
                      value="male"
                    )
                  label.c.card__radio-label F
                    input.card__radio-input(
                      type="radio",
                      name="gender",
                      v-model="fan.gender",
                      value="female"
                    )

                button.card__btn.button_green(
                  ref="fixBtn",
                  :disabled="disForm",
                  @click.prevent="editFan"
                ) Изменить

                button.card__btn.button_blue.ml(
                  ref='rankBtn',
                  :disabled="disForm",
                  v-if="this.fan.rank.name == 'Звезда'"
                  @click.prevent="changeRang"
                ) Выдать легенду

                button.button.button_red.ml(
                  type="button",
                  @click.prevent="fanDelete"
                ) Удалить

      .card__loader(v-if="!fan")
        span.loader
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";

import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
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
      fan: null,
      title: "Данные фаната",
      disForm: false,
      deleteAva: "",
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
    changeRang() {
      axios
        .patch(
          `${URL}/api/fan/${+this.id}/rank`,
          {
            rank: this.fan.rank,
          },
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        )
        .catch((error) => this.errorFun(error))
        .finally(() => {
          this.$refs.rankBtn.innerHTML = "Успешно!";
          setTimeout(() => {
            this.$refs.rankBtn.innerHTML = "Изменить";
            this.disForm = false;
            this.getFan();
          }, 3000);
        });
    },
    getFan() {
      axios
        .get(`${URL}/api/fan/${+this.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.fan = data;
        })
        .catch((error) => this.errorFun(error));
    },
    editFan() {
      this.$refs.fixBtn.innerHTML = "Отправка...";
      this.disForm = true;
      axios
        .patch(
          `${URL}/api/fan/${+this.id}`,
          {
            name: this.fan.name,
            surname: this.fan.surname,
            gender: this.fan.gender,
            email: this.fan.email,
          },
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        )
        .catch((error) => this.errorFun(error))
        .finally(() => {
          this.$refs.fixBtn.innerHTML = "Успешно!";
          setTimeout(() => {
            this.$refs.fixBtn.innerHTML = "Изменить";
            this.disForm = false;
            this.$router.push("/fans");
          }, 3000);
        });
    },
    fanAvaDelete() {
      axios
        .patch(
          `${URL}/api/fan/${+this.id}/avatar`,
          {
            avatar: this.deleteAva,
          },
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        )
        .catch((error) => this.errorFun(error))
        .finally(() => {
          this.getFan();
        });
    },
    fanDelete() {
      axios
        .delete(`${URL}/api/fan/${+this.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.$router.push("/fans");
        })
        .catch((error) => this.errorFun(error));
    },
  },
  mounted() {
    this.getFan();
    
  },
};
</script>
