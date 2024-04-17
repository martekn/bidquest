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
import LoadingButton from "@/components/LoadingButton.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
// #endregion

const isLoading = ref(false);
const apiError = reactive([]);
const registerBody = reactive({ name: "", email: "", password: "" });

const nameField = reactive({
  isError: false,
  error: ""
});

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

    await auth.register(registerBody);
  } catch (error) {
    isLoading.value = false;
    apiError.push([...error.errors]);
    nameField.isError = true;
    emailField.isError = true;
    passwordField.isError = true;
  }
};

const validate = () => {
  nameField.error = "";
  emailField.error = "";
  passwordField.error = "";
  apiError.length = 0;

  nameField.error = Validate.username(registerBody.name);
  emailField.error = Validate.email(registerBody.email);
  passwordField.error = Validate.password(registerBody.password);

  nameField.isError = nameField.error ? true : false;
  emailField.isError = emailField.error ? true : false;
  passwordField.isError = passwordField.error ? true : false;

  if (!nameField.error && !emailField.error && !passwordField.error) {
    submit();
  }
};
</script>

<template>
  <main
    class="grid place-items-start bg-opacity-50 bg-straws-pattern bg-repeat py-8 sm:place-items-center"
  >
    <form
      @submit.prevent
      class="mx-auto grid w-full gap-6 p-5 sm:max-w-lg sm:rounded sm:border sm:border-grey-300 sm:bg-white sm:p-9 sm:shadow-md sm:shadow-black/10"
    >
      <h1 class="text-lg md:text-xl">Create account</h1>
      <ErrorDialog
        id="register-error"
        v-if="apiError.length > 0"
        title="We could not create your account"
      >
        <ul class="list-inside list-disc">
          <li v-for="[error, index] in apiError" :key="index">{{ error.message }}</li>
        </ul>
      </ErrorDialog>

      <TextInput
        v-model="registerBody.name"
        :error="nameField.error"
        :is-error="nameField.isError"
        id="name"
        label="Username"
        type="test"
      />
      <TextInput
        v-model="registerBody.email"
        :error="emailField.error"
        :is-error="emailField.isError"
        id="email"
        label="Email"
        type="email"
      />
      <PasswordInput
        v-model="registerBody.password"
        :error="passwordField.error"
        :is-error="passwordField.isError"
        id="password"
        label="Password"
      />

      <LoadingButton @buttonClicked="validate" :buttonLoading="isLoading"> Create</LoadingButton>
      <span class="border-t border-t-grey-300 pt-6 leading-tight text-grey-500"
        >Already have an account?
        <RouterLink class="link link-secondary" :to="{ name: 'login' }">login</RouterLink></span
      >
    </form>
  </main>
</template>
