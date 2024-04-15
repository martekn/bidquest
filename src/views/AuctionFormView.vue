<script setup>
import { reactive, ref, computed } from "vue";
import { nanoid } from "@/helper/nanoid.js";
import { notify } from "notiwind";
import router from "@/router";
import dayjs from "dayjs";
import { auction } from "@/api";
import { categories } from "@/consts/navItems";
import TextInput from "@/components/formElements/TextInput.vue";
import TextareaInput from "@/components/formElements/TextareaInput.vue";
import ImageManager from "@/components/ImageManager.vue";
import ListBox from "@/components/formElements/ListBox.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

const apiError = reactive([]);
const isLoading = ref(false);

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
  if (auctionBody.title && auctionBody.endsAt) {
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

  try {
    isLoading.value = true;
    const response = await auction.create(auctionBody);

    notify(
      {
        group: "general",
        title: "Auction created",
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
  if (auctionBody.title && auctionBody.endsAt && auctionBody.description.length <= 280) {
    titleField.isError = false;
    dateField.isError = false;
    submit();
    return;
  }

  if (!auctionBody.title) {
    titleField.isError = true;
  }

  if (!auctionBody.endsAt) {
    dateField.isError = true;
  }
  if (auctionBody.description.length > 280) {
    descriptionField.isError = true;
  }
};
</script>

<template>
  <main class="bg-straws-pattern">
    <form @submit.prevent novalidate class="mx-auto max-w-2xl px-5 pb-11 pt-6 md:pb-12 md:pt-7">
      <div>
        <h1>Create an auction</h1>
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
          v-model="auctionBody.endsAt"
          label="End date and time"
          id="date"
          type="datetime-local"
          :min="minDateTime"
          :max="maxDateTime"
          :is-error="dateField.isError"
          :error="dateField.error"
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
          <span v-if="!isLoading"> Create Auction </span>
          <LoadingIndicator v-else color="light" />
        </button>
      </div>
    </form>
  </main>
</template>
