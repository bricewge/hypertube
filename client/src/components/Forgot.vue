<template>
<visitor-background>
  <default-form
    title="Forgot your password?"
    :alert="alert"
    :form="form"
    ref="defaultForm">
    <div slot="fields">
      <v-text-field
        name="email"
        label="Email"
        v-model="email"
        :rules="emailRules"
        ></v-text-field>
    </div>
    <v-layout slot="actions">
      <router-link
        to="/login"
        class="ml-1 grey--text text--darken-1"
        >Login</router-link>
      <v-spacer></v-spacer>
      <v-btn
        type="submit"
        color="primary"
        :disabled="!buttonEnabled"
        >Send me instructions</v-btn>
    </v-layout>
</default-form>
</visitor-background>
</template>

<script>
import DefaultForm from '@/components/DefaultForm'
import VisitorBackground from '@/components/VisitorBackground'
// import AuthenticationService from '@/services/AuthenticationService'
import {validEmail} from '@/util/validation'

export default {
  components: {
    DefaultForm,
    VisitorBackground
  },

  data () {
    return {
      email: '',
      emailRules: [validEmail],
      buttonEnabled: true,
      alert: { type: 'error', visible: false, message: '' },
      form: { valid: false, submit: this.forgot }
    }
  },

  methods: {
    async forgot () {
      if (!this.$refs.defaultForm.$refs.form.validate()) return
      try {
        const response = await this.axios.post('/auth/forgot', {email: this.email})
        this.alert.type = 'success'
        this.alert.message = response.data.message
        this.alert.visible = true
        this.buttonEnabled = false
      } catch (err) {
        this.alert.type = 'error'
        this.alert.message = err.response.data.message
        this.alert.visible = true
      }
    }
  }
}
</script>

<style scoped>
</style>
