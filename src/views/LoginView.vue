<script setup>
// #region -IMPORTS-
// Vue-related imports
import { reactive, ref } from "vue";

// Custom module/helper imports
import { auth } from "@/api";
import { Validate } from "@/helper/Validate";

// Custom components
import PasswordInput from "@/components/formElements/PasswordInput.vue";
import TextInput from "@/components/formElements/TextInput.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import LoadingButton from "@/components/LoadingButton.vue";
// #endregion

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
    await auth.login(loginBody);
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
  <main class="grid place-items-start bg-straws-pattern py-8 sm:place-items-center">
    <form
      @submit.prevent
      class="mx-auto grid w-full gap-6 p-5 sm:max-w-lg sm:rounded sm:border sm:border-grey-300 sm:bg-white sm:p-9 sm:shadow-md sm:shadow-black/10"
    >
      <h1 class="text-lg md:text-xl">Login</h1>
      <ErrorDialog id="login-error" v-if="apiError.length > 0" title="We could not log you in">
        <ul class="list-inside list-disc">
          <li v-for="[error, index] in apiError" :key="index">{{ error.message }}</li>
        </ul>
      </ErrorDialog>

      <TextInput
        v-model="loginBody.email"
        :is-error="emailField.isError"
        :error="emailField.error"
        id="email"
        label="Email"
        type="email"
      />
      <PasswordInput
        v-model="loginBody.password"
        :is-error="passwordField.isError"
        :error="passwordField.error"
        id="password"
        label="Password"
      />

      <LoadingButton @buttonClicked="validate" :buttonLoading="isLoading"> Login</LoadingButton>
      <span class="border-t border-t-grey-300 pt-6 leading-tight text-grey-500"
        >Dont have an account?
        <RouterLink class="link link-secondary" :to="{ name: 'register' }"
          >Sign up</RouterLink
        ></span
      >
    </form>
  </main>
</template>
