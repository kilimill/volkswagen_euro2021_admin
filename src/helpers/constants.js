// export const URL = 'http://localhost:3000'
export const URL = process.env.VUE_APP_BACK_ENV === 'production' ? 'https://vw-football.championat.com' : 'https://volkswagen-euro2021.aaadev.ru'
