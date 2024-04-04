<script setup>
import { reactive, ref } from "vue";
import PasswordInput from "@/components/formElements/PasswordInput.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import TextInput from "@/components/formElements/TextInput.vue";
import { XCircleIcon } from "@heroicons/vue/20/solid";
import { login } from "@/api/auth/login";
import { Validate } from "@/helper/Validate";

const isLoading = ref(false);
const apiError = reactive([]);
const loginBody = reactive({ email: "", password: "" });

const emailField = reactive({
  isError: false,
  error: ""
});

const passwordField = reactive({
  isError: false,
  error: ""
});

const submit = async () => {
  try {
    isLoading.value = true;
    await login(loginBody);
  } catch (error) {
    isLoading.value = false;
    apiError.push([...error.errors]);
    emailField.isError = true;
    passwordField.isError = true;
  }
};

const validate = () => {
  passwordField.error = "";
  emailField.error = "";
  apiError.length = 0;

  emailField.error = Validate.email(loginBody.email);
  passwordField.error = Validate.password(loginBody.password);

  emailField.isError = emailField.error ? true : false;
  passwordField.isError = passwordField.error ? true : false;

  if (!emailField.error && !passwordField.error) {
    submit();
  }
};
</script>

<template>
  <main class="grid flex-1 place-items-center bg-opacity-50 bg-straws-pattern bg-repeat">
    <form
      @submit.prevent
      class="mx-auto grid w-full gap-6 border border-grey-300 p-5 sm:max-w-lg sm:rounded sm:bg-white sm:p-9 sm:shadow-md sm:shadow-black/10"
    >
      <h1 class="text-lg md:text-xl">Login</h1>
      <div v-if="apiError.length > 0" class="flex w-full items-start gap-3 rounded bg-red-300 p-5">
        <XCircleIcon class="my-1 h-5 w-5 flex-shrink-0 text-red-400" />

        <div class="flex flex-col gap-2">
          <p class="font-semibold leading-tight">We could not log you in</p>
          <ul class="list-inside list-disc">
            <li v-for="[error, index] in apiError" :key="index">{{ error.message }}</li>
          </ul>
        </div>
      </div>
      <TextInput
        v-model="loginBody.email"
        :is-error="emailField.isError"
        :error="emailField.error"
        label="Email"
        type="email"
      />
      <PasswordInput
        v-model="loginBody.password"
        :is-error="passwordField.isError"
        :error="passwordField.error"
        label="Password"
      />

      <button type="submit" class="button button-primary" @click="validate">
        <span v-if="!isLoading"> Login </span>
        <LoadingIndicator v-else color="light" />
      </button>
      <span class="border-t border-t-grey-300 pt-6 leading-tight text-grey-500"
        >Dont have an account?
        <RouterLink class="link link-secondary" to="/register">Sign up</RouterLink></span
      >
    </form>
  </main>
</template>
