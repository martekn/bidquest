<script setup>
// #region -IMPORTS-
// Vue-related imports
import { reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

// Custom module/helper imports
import { auth } from "@/api";
import { Validate } from "@/helper/Validate";

// Custom components
import PasswordInput from "@/components/formElements/PasswordInput.vue";
import TextInput from "@/components/formElements/TextInput.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
// #endregion

const route = useRoute();
const isLoading = ref(false);
const apiError = reactive([]);
const form = reactive({ name: "", email: "", password: "" });

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

const resetError = () => {
  nameField.error = "";
  nameField.isError = false;
  emailField.error = "";
  emailField.isError = false;
  passwordField.error = "";
  passwordField.isError = false;
  apiError.length = 0;
};

const submit = async () => {
  try {
    isLoading.value = true;
    if (route.name === "register") {
      await auth.register(form);
    } else {
      await auth.login(form);
    }
  } catch (error) {
    isLoading.value = false;
    apiError.push([...error.errors]);
    nameField.isError = true;
    emailField.isError = true;
    passwordField.isError = true;
  }
};

const validate = () => {
  resetError();

  nameField.error = Validate.username(form.name);
  emailField.error = Validate.email(form.email);
  passwordField.error = Validate.password(form.password);

  nameField.isError = nameField.error ? true : false;
  emailField.isError = emailField.error ? true : false;
  passwordField.isError = passwordField.error ? true : false;

  if (
    ((route.name === "register" && !nameField.error) || route.name === "login") &&
    !emailField.error &&
    !passwordField.error
  ) {
    submit();
  }
};

watch(
  () => route.name,
  () => {
    resetError();
    form.name = "";
    form.email = "";
    form.password = "";
  }
);
</script>

<template>
  <main class="flex items-start bg-straws-pattern py-10 sm:items-center sm:justify-items-center">
    <form
      @submit.prevent
      class="mx-auto grid w-full gap-6 p-5 sm:max-w-lg sm:rounded sm:border sm:border-grey-300 sm:bg-white sm:p-9 sm:shadow-md sm:shadow-black/10"
    >
      <h1 class="text-lg md:text-xl">
        {{ route.name === "register" ? "Create account" : "Login" }}
      </h1>
      <ErrorDialog
        id="auth-error"
        v-if="apiError.length > 0"
        :title="
          route.name === 'register' ? 'We could not create your account' : 'We could not log you in'
        "
      >
        <ul class="list-inside list-disc">
          <li v-for="[error, index] in apiError" :key="index">{{ error.message }}</li>
        </ul>
      </ErrorDialog>

      <TextInput
        v-if="route.name === 'register'"
        v-model="form.name"
        :error="nameField.error"
        :is-error="nameField.isError"
        id="name"
        label="Username"
        type="text"
      />
      <TextInput
        v-model="form.email"
        :error="emailField.error"
        :is-error="emailField.isError"
        id="email"
        label="Email"
        type="email"
      />
      <PasswordInput
        v-model="form.password"
        :error="passwordField.error"
        :is-error="passwordField.isError"
        id="password"
        label="Password"
      />

      <LoadingButton @buttonClicked="validate" :buttonLoading="isLoading">{{
        route.name === "register" ? "Create" : "Login"
      }}</LoadingButton>
      <span class="border-t border-t-grey-300 pt-6 leading-tight text-grey-500"
        >{{ route.name === "register" ? "Already" : "Dont" }} have an account?
        <RouterLink
          class="link link-secondary"
          :to="{ name: route.name === 'register' ? 'login' : 'register' }"
          >{{ route.name === "register" ? "Login" : "Register " }}</RouterLink
        ></span
      >
    </form>
  </main>
</template>
