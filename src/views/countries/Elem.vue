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
        li.tile(v-if="country")
          .card
            form.card__content(ref="file")
              .card__content-flag
                img.card__content-img(:src="country.flag") 
                .country__form-wrapper
                  label.country__form-button
                    input.country__form-file(
                      type="file",
                      name="flag",
                      accept="image/png,image/jpeg",
                      @change="editFlag"
                    )
                    span.input__file-icon-wrapper
                    span.input__file-button-text Изменить флаг
            form.card__content(@submit.prevent="editCountry") 
              .card__field
                label.card__label Страна
                input.card__control(
                  v-model="country.name",
                  name="name",
                  ref="inputCountry",
                  required
                )
              .card__field
                label.card__label Код страны
                input.card__control(
                  v-model="country.code",
                  name="code",
                  ref="inputCode",
                  required
                )
              button.card__btn.button_green(ref="fixBtn") Изменить
            hr
            footer.card__footer
              button.button.button_red(
                type="button",
                @click.prevent="countryDelete"
              ) Удалить

      .card__loader(v-if="!country")
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
      country: null,
      title: "Данные страны",
    };
  },
  methods: {
    ...mapActions(["setToken", "setUser", "setUsers"]),
    getCountry() {
      axios
        .get(`${URL}/api/country/${+this.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => (this.country = data))
        .catch((error) => this.errorFun(error));
    },
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      console.log(error.response.data.message);
    },
    editFlag() {
      let formData = new FormData(this.$refs.file);
      axios({
        method: "patch",
        url: `${URL}/api/country/${+this.id}/flag`,
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
          this.getCountry();
        });
    },
    editCountry() {
      this.$refs.fixBtn.innerHTML = "Отправка...";
      this.disBtn = true;
      axios
        .patch(
          `${URL}/api/country/${+this.id}`,
          {
            name: this.$refs.inputCountry.value,
            code: this.$refs.inputCode.value,
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
            this.disBtn = false;
            this.$router.push("/contries");
          }, 3000);
        });
    },
    countryDelete() {
      axios
        .delete(`${URL}/api/country/${+this.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.$router.push("/contries");
        })
        .catch((error) => this.errorFun(error))
    },
  },
  mounted() {
    this.getCountry();
  },
};
</script>
