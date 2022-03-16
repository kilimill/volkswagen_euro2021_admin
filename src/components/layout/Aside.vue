<template lang="pug">
  aside.aside
    p.aside__title
      b Admin 
      span {{ getUser.name }}

    menu.aside__menu-container
      p.aside__menu-label Главная
      ul.aside__menu-list
        li
          <router-link to="/" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-desktop-mac.default
            | Главная
          </router-link>
        </li>
      </ul>

      p.aside__menu-label Основное
      ul.aside__menu-list
        li
          <router-link to="/contries" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-flag.default
            | Страны
          </router-link>
        li
          <router-link to="/matches" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-gamepad.default
            | Матчи
          </router-link>
        li
          <router-link to="/fans" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-account-group.default
            | Фанаты
          </router-link>
        li
          <router-link to="/news" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-newspaper.default
            | Новости
          </router-link>
        li
          <router-link to="/support" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-file.default
            | Поддержка
          </router-link>

    menu.aside__menu.aside__menu_bottom
      ul.aside__menu-list
        li
          a.aside__menu-link.aside__menu-link_icon.aside__menu-link_logout(href="/logout" @click.prevent="logoutUser")
            span.icon
              i.mdi.mdi-logout.default
            | Выйти
          </router-link>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'getUser',
    ]),
  },
  methods: {
    ...mapActions([
      'setToken',
      'setUser',
    ]),
    logoutUser() {
      this.setToken(null);
      this.$router.push('/login');
    }
  },
}
</script>
