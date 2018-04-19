<template>
<visitor-background>
  <default-form
    title="Reset your password"
    :alert="alert"
    :form="form"
    ref="defaultForm">
    <div slot="fields">
      <v-text-field
        required
        v-model="password"
        v-on:input="samePasswords"
        name="password"
        label="Password"
        :rules="passwordRules"
        :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
        :append-icon-cb="() => (hidePassword = !hidePassword)"
        :type="hidePassword ? 'password' : 'text'"
        ></v-text-field>
      <v-text-field
        required
        v-model="confirmPassword"
        v-on:input="samePasswords"
        name="confirmPassword"
        label="Confirm password"
        :rules="confirmPasswordRules"
        :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
        :append-icon-cb="() => (hidePassword = !hidePassword)"
        :type="hidePassword ? 'password' : 'text'"
        ></v-text-field>
    </div>
    <v-layout slot="actions">
      <v-spacer></v-spacer>
      <v-btn
        type="submit"
        color="primary"
        >Reset</v-btn>
  </v-layout>
</default-form>
</visitor-background>
</template>

<script>
import DefaultForm from '@/components/DefaultForm'
import VisitorBackground from '@/components/VisitorBackground'
// import AuthenticationService from '@/services/AuthenticationService'
import {validPassword, nonEmptyPassword} from '@/util/validation'

export default {
  components: {
    DefaultForm,
    VisitorBackground
  },

  data () {
    return {
      password: '',
      passwordRules: [ nonEmptyPassword, validPassword ],
      confirmPassword: '',
      confirmPasswordRules: [ ],
      hidePassword: true,
      alert: { type: 'error', visible: false, message: '' },
      form: { valid: false, submit: this.reset }
    }
  },
  methods: {
    async reset () {
      this.samePasswords()
      if (!this.$refs.defaultForm.$refs.form.validate()) return
      try {
        await this.axios.post('/auth/reset', {
          resetPasswordToken: this.$route.params.token,
          password: this.password
        })
        this.$router.push('/login')
      } catch (err) {
        this.alert.type = 'error'
        this.alert.message = err.response.data.message
        this.alert.visible = true
      }
    },

    // TODO Tidy this thing up
    samePasswords () {
      if (!this.confirmPassword) {
        this.confirmPasswordRules = [v => !!v || 'Confirm password is required']
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordRules = [ v => 'Password aren\'t the same' ]
      } else {
        this.confirmPasswordRules = [ ]
      }
    }
  }
}
</script>

<style scoped>
</style>
