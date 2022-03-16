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
        li.tile(v-if="info")
          .card
            form.card__content.form__views(
              ref="formImg"
            )
              .card__content-flag
                img.card__content-img(:src="info.img") 
                .country__form-wrapper
                  label.country__form-button
                    input.country__form-file(
                      type="file",
                      name="img",
                      accept="image/png,image/jpeg"
                      @change='editNewsImg'
                    )
                    span.input__file-icon-wrapper
                    span.input__file-button-text Изменить обложку
            form.card__content.form__views(@submit.prevent="editNews")
              .card__field
                label.card__label Заголовок
                input.card__control.input(
                  name="title",
                  type="text",
                  v-model="info.title",
                  required
                )
              .card__field
                label.card__label Ссылка
                input.card__control.input(
                  name="url",
                  type="text",
                  v-model="info.url",
                  required
                )
              .card__field
                label.card__label Тип
                select.data__select.card__select(
                  v-model="info.type",
                  name="type"
                )
                  option(value="ROADSHOW") ROADSHOW
                  option(value="PARTNER") PARTNER
                  option(value="VWNEWS") VWNEWS

              label.card__label.card__radio-label Опубликовать
                input.card__checbox(
                  type="checkbox",
                  @change="statusEdit",
                  :checked="this.status == 'PUBLISHED' ? true : false",
                  name="status"
                )
                span.card__checboxstyle

              button.card__btn.button_green.matches__form-btn(
                ref="fixBtn",
                :disabled="disBtn"
              ) Изменить
            hr
            footer.card__footer
              button.button.button_red(
                type="button",
                @click.prevent="newsDelete"
              ) Удалить

      .card__loader(v-if="!info")
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
      title: "Детали новости",
      info: null,
      disBtn: false,
      status: null,
    };
  },
  methods: {
    statusEdit(e) {
      if (e.target.checked) {
        this.status = "published";
      } else {
        this.status = "unpublished";
      }
    },
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      console.log(error.response.data.message);
    },
    ...mapActions(["setToken", "setUser", "setUsers"]),
    editNewsImg() {
      let formData = new FormData(this.$refs.formImg);
      axios({
        method: "patch",
        url: `${URL}/api/news/${+this.id}/img`,
        data: formData,
        headers: {
          Authorization: `Bearer ${this.getToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((error) => this.errorFun(error))
      .finally(() => this.getNews())
    },
    editNews() {
      this.$refs.fixBtn.innerHTML = "Отправка...";
      this.disBtn = true;
      axios({
        method: "patch",
        url: `${URL}/api/news/${+this.id}`,
        data: {
          title: this.info.title,
          url: this.info.url,
          type: this.info.type,
        },
        headers: {
          Authorization: `Bearer ${this.getToken}`,
        },
      })
        .then(() => {
          axios
            .patch(
              `${URL}/api/news/${this.id}/status`,
              {
                status: this.status,
              },
              {
                headers: { Authorization: `Bearer ${this.getToken}` },
              }
            )
            .catch((error) => this.errorFun(error));
        })
        .catch((error) => this.errorFun(error))
        .finally(() => {
          this.$refs.fixBtn.innerHTML = "Успешно!";
          setTimeout(() => {
            this.$refs.fixBtn.innerHTML = "Изменить";
            this.disBtn = false;
            this.$router.push("/news");
          }, 3000);
        });
    },
    getNews() {
      axios
        .get(`${URL}/api/news/${+this.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.info = data;
          this.status = data.status;
        })
        .catch((error) => this.errorFun(error));
    },
    newsDelete() {
      axios
        .delete(`${URL}/api/news/${+this.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.$router.push("/news");
        })
        .catch((error) => this.errorFun(error));
    },
  },
  mounted() {
    this.getNews();
  },
};
</script>
