<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ title }}

  section.title__bar.title__default {{ title }}

  section.dashboard
    ul.tiles
      li.tile
        .dashboard__info
          .dashboard__item
            .dashboard__widget
              p.dashboard__subtitle Фанатов
              p.dashboard__title {{ fans.length }}
          .dashboard__item
            span.dashboard__icon.is-large.dashboard__icon_peoples
              i.mdi.mdi-account-multiple.mdi-48px

      li.tile
        .dashboard__info
          .dashboard__item
            .dashboard__widget
              p.dashboard__subtitle Новостей
              p.dashboard__title {{ news.length }}
          .dashboard__item
            span.dashboard__icon.is-large.dashboard__icon_comments
              i.mdi.mdi-chart-timeline-variant.mdi-48px
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

import axios from "axios";
import { URL } from "@/helpers/constants";

export default {
  computed: {
    ...mapGetters(["getToken"]),
  },
  methods: {
    ...mapActions(["setToken"]),
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      console.log(error.response.data.message);
    },
    reloadFans() {
      axios
        .get(`${URL}/api/fan`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.fans = data;
        })
        .catch(this.errorFun);
    },
    reloadNews() {
      axios
        .get(`${URL}/api/news`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.news = data;
        })
        .catch(this.errorFun);
    },
  },
  mounted() {
    this.reloadFans();
    this.reloadNews();
  },
  data() {
    return {
      title: "Главная",
      fans: [],
      news: [],
    };
  },
};
</script>