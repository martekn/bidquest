<script setup>
// #region -IMPORTS-
// Vue-related imports
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

// Third-party library imports
import { notify } from "notiwind";
import { DocumentMinusIcon } from "@heroicons/vue/20/solid";
import dayjs from "dayjs";

// Custom module/helper imports
import { nanoid } from "@/helper/nanoid.js";
import { auction } from "@/api";
import { AuthStateManager } from "@/helper/AuthStateManager";

// Constants imports
import { categories } from "@/consts/navItems";

// Custom components
import TextInput from "@/components/formElements/TextInput.vue";
import TextareaInput from "@/components/formElements/TextareaInput.vue";
import ImageManager from "@/components/ImageManager.vue";
import ListBox from "@/components/formElements/ListBox.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
// #endregion

const route = useRoute();

const apiError = reactive([]);
const isLoading = ref(false);
const isInvalidId = ref(false);

const dateValue = ref();

const imageField = ref();
const images = reactive([]);

const currentDate = dayjs();
const minDateTime = currentDate.format("YYYY-MM-DDTHH:mm");
const maxDateTime = currentDate.add(1, "year").format("YYYY-MM-DDTHH:mm");

const categoryOptions = categories.map((category) => {
  return { value: category, label: category.charAt(0).toUpperCase() + category.slice(1) };
});
categoryOptions.unshift({ value: "none", label: "No category selected" });

const selectedCategory = ref(categoryOptions[0].value);

const auctionBody = reactive({
  title: "",
  description: "",
  tags: [],
  media: [],
  endsAt: ""
});

const isConfirmOpen = ref(false);

const titleField = reactive({
  isError: false,
  error: "Title is required"
});

const dateField = reactive({
  isError: false,
  error: "Date is required"
});

const descriptionField = reactive({
  isError: false,
  error: "The description cannot be longer than 280 characters"
});

const requiredFilled = computed(() => {
  if (auctionBody.title && dateValue) {
    return true;
  } else {
    return false;
  }
});

const addImage = () => {
  images.push({ url: imageField.value, alt: "", id: nanoid() });
  imageField.value = "";
};

const moveImage = (from, to) => {
  const image = images[from];
  images.splice(from, 1);
  images.splice(to, 0, image);
};

const moveImageUp = (index) => {
  moveImage(index, index - 1);
};

const moveImageDown = (index) => {
  moveImage(index, index + 1);
};

const deleteImage = (index) => {
  images.splice(index, 1);
};

const submit = async () => {
  if (images.length > 0) {
    auctionBody.media.push(...images);
  }

  if (selectedCategory.value !== "none") {
    auctionBody.tags.push(selectedCategory.value);
  }

  auctionBody.endsAt = new Date(dateValue.value).toISOString();

  try {
    isLoading.value = true;
    let response;
    let successMessage = "Auction created";
    if (route.name === "create") {
      response = await auction.create(auctionBody);
    } else {
      response = await auction.update(route.params.id, auctionBody);
      successMessage = "Auction edited";
    }

    notify(
      {
        group: "general",
        title: successMessage,
        type: "success"
      },
      2000
    );

    router.push({ name: "auction", params: { id: response.data.id } });
  } catch (error) {
    isLoading.value = false;
    window.scrollTo(0, 0);
    apiError.push([...error.errors]);
  }
};

const validate = () => {
  if (auctionBody.title && dateValue && auctionBody.description.length <= 280) {
    titleField.isError = false;
    dateField.isError = false;
    submit();
    return;
  }

  if (!auctionBody.title) {
    titleField.isError = true;
  }

  if (!dateValue.value) {
    dateField.isError = true;
  }
  if (auctionBody.description.length > 280) {
    descriptionField.isError = true;
  }
};

const getAuction = async () => {
  try {
    const response = await auction.getSingle(route.params.id);

    if (response.data.seller.name !== AuthStateManager.getUsername()) {
      router.push({ name: "create" });
    }

    auctionBody.title = response.data.title;
    auctionBody.description = response.data.description;

    dateValue.value = dayjs(response.data.endsAt).format("YYYY-MM-DDTHH:mm");

    if (response.data.tags.length > 0) {
      const tags = response.data.tags.filter((tag) => categories.includes(tag));
      selectedCategory.value = tags[0];
    }

    for (const image of response.data.media) {
      image.id = nanoid();
      images.push(image);
    }
  } catch (error) {
    if (error.statusCode === 404 || error.errors[0].code === "invalid_string") {
      isInvalidId.value = true;
    }
  }
};

const deleteAuction = async () => {
  try {
    await auction.remove(route.params.id);
    notify(
      {
        group: "general",
        title: "Auction deleted",
        type: "success"
      },
      2000
    );
    isConfirmOpen.value = false;
    router.push({ name: "profile", params: { username: AuthStateManager.getUsername() } });
  } catch (error) {
    notify(
      {
        group: "general",
        title: "Unable to delete auction",
        text: "Please try again",
        type: "error"
      },
      3000
    );
    isConfirmOpen.value = false;
  }
};

onMounted(() => {
  if (route.name === "edit") {
    getAuction();
  }
});

watch(
  () => [route.name, route.params.id],
  () => {
    auctionBody.title = "";
    auctionBody.description = "";
    auctionBody.tags.length = 0;
    auctionBody.media.length = 0;
    dateValue.value = "";
  }
);
</script>

<template>
  <NotFoundView v-if="isInvalidId"></NotFoundView>
  <main v-else class="bg-straws-pattern">
    <form @submit.prevent novalidate class="mx-auto max-w-2xl px-5 pb-11 pt-6 md:pb-12 md:pt-7">
      <div class="flex flex-wrap items-center justify-between gap-6">
        <h1>{{ route.name === "create" ? "Create an auction" : "Edit auction" }}</h1>
        <button
          v-if="route.name === 'edit'"
          @click="isConfirmOpen = true"
          class="flex items-center gap-2 rounded font-semibold text-grey-500 outline-none transition-all hover:text-red-400 focus-visible:ring-2 focus-visible:ring-black"
        >
          <DocumentMinusIcon class="h-5 w-5" /> Delete
        </button>
      </div>
      <ErrorDialog class="mt-7" v-if="apiError.length > 0" title="We could not create auction">
        <ul class="list-inside list-disc">
          <li v-for="[error, index] in apiError" :key="index">{{ error.message }}</li>
        </ul>
      </ErrorDialog>
      <div class="mt-7 grid gap-7 md:grid-cols-2">
        <TextInput
          v-model="auctionBody.title"
          id="title"
          label="Title"
          type="text"
          :is-error="titleField.isError"
          :error="titleField.error"
          class="md:col-span-full"
        />

        <TextInput
          v-model="dateValue"
          label="End date and time"
          id="date"
          type="datetime-local"
          :min="minDateTime"
          :max="maxDateTime"
          :is-error="dateField.isError"
          :error="dateField.error"
          :disabled="route.name === 'edit'"
          class="flex-grow"
        />

        <ListBox
          placeholder="Select category"
          v-model="selectedCategory"
          :options="categoryOptions"
          optional
          id="category"
          label="Category"
        />

        <TextareaInput
          v-model="auctionBody.description"
          label="Description"
          id="description"
          :is-error="descriptionField.isError"
          :error="descriptionField.error"
          optional
          class="h-[17rem] md:col-span-full"
        />
      </div>
      <section class="mb-7 mt-9 border-b border-b-grey-300">
        <h2>Images <span class="font-normal text-grey-500">(Optional)</span></h2>
        <p class="mt-3 text-grey-500">
          To designate the main image for the auction, simply use the first image listed. You can
          rearrange the images by using the arrow buttons to adjust their order.
        </p>
        <div
          class="mt-7 flex gap-4"
          :class="{
            ' border-b border-b-grey-300 pb-7': images.length > 0,
            'mb-7': images.length === 0
          }"
        >
          <TextInput
            v-model="imageField"
            id="image"
            label="Image url"
            type="url"
            class="flex-grow"
          />
          <button
            class="button button-secondary self-end py-[calc(0.5rem+1px)] leading-normal"
            @click="addImage"
          >
            Add
          </button>
        </div>
        <ImageManager
          :images="images"
          @moveUp="moveImageUp"
          @moveDown="moveImageDown"
          @delete="deleteImage"
        ></ImageManager>
      </section>
      <div class="flex flex-col gap-5">
        <span class="text-sm text-grey-500" v-if="!requiredFilled"
          >You need to fill out title and end date before you can continue</span
        >

        <button
          type="submit"
          :disabled="!requiredFilled"
          class="button button-primary"
          @click="validate"
        >
          <span v-if="!isLoading">
            {{ route.name === "create" ? "Create Auction" : "Save Auction" }}
          </span>
          <LoadingIndicator v-else color="light" />
        </button>
      </div>
    </form>
    <ConfirmationDialog
      :isOpen="isConfirmOpen"
      @close="isConfirmOpen = false"
      @confirm="deleteAuction"
      ctaText="Delete"
      title="Delete Profile Picture"
    >
      Are you sure you want to delete this auction? This action cannot be undone, and the auction
      will be permanently deleted</ConfirmationDialog
    >
  </main>
</template>
