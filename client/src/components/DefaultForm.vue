<template>
<v-card>
  <v-card-title>
    <v-toolbar-title class="text-xs-center">
      {{ title }}</v-toolbar-title>
  </v-card-title>
  <v-form
    v-model="form.valid"
    ref="form"
    @submit.prevent="form.submit"
    lazy-validation>
    <v-card-text>
      <slot name="fields">No fields defined</slot>
      <v-alert
        ref="alert"
        :type="alert.type"
        v-model="alert.visible"
        :dismissible="alert.dismissible"
        transition="scale-transition"
        >{{ alert.message }}</v-alert>
    </v-card-text>
    <v-card-actions class="pb-3 mx-1">
      <slot name="actions">No actions defined</slot>
    </v-card-actions>
  </v-form>
</v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    form: {
      type: Object,
      default: () => ({
        valid: true,
        submit: () => {}
      })
    },
    alert: {
      type: Object,
      default: () => ({
        type: 'error',
        visible: false,
        message: 'Error message',
        dismissible: true
      })
    }
  }
}
</script>

<style>
.layout.slot a {
    align-self: center;
}
</style>
