<script setup>
import { reactive } from "vue";
import PasswordInput from "@/components/formElements/PasswordInput.vue";
import TextInput from "@/components/formElements/TextInput.vue";

const registerBody = reactive({ name: "", email: "", password: "" });
</script>

<template>
  <main class="bg-straws-pattern grid flex-1 place-items-center bg-opacity-50 bg-repeat">
    <form
      @submit.prevent
      class="mx-auto grid w-full gap-7 border border-grey-300 p-5 sm:max-w-lg sm:rounded sm:bg-white sm:p-9 sm:shadow-md sm:shadow-black/10"
    >
      <h1 class="text-lg md:text-xl">Create account</h1>

      <TextInput v-model="registerBody.name" label="Username" type="test" />
      <TextInput v-model="registerBody.email" label="Email" type="email" />
      <PasswordInput v-model="registerBody.password" label="Password" />

      <button class="button button-primary">Create</button>
      <span class="border-t border-t-grey-300 pt-6 leading-tight text-grey-500"
        >Already have an account?
        <RouterLink class="link link-secondary" to="/login">login</RouterLink></span
      >
    </form>
  </main>
</template>
