import Vue from 'vue'
import VueI18n from 'vue-i18n'

import fr from './fr.json'
import en from './en.json'
import zh from './zh.json'
import st from './st.json'

Vue.use(VueI18n)

const locale = 'fr'

const messages = {
  fr: fr,
  en: en,
  zh: zh,
  st: st
}

export default new VueI18n({
  locale,
  messages
})
