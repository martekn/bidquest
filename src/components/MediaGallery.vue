<script setup>
// #region -IMPORTS-
// Vue-related imports
import { onMounted, ref } from "vue";

// Third-party library imports
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/vue/20/solid";

// Custom module/helper imports
import { debounce } from "@/helper/debounce";
// #endregion

const props = defineProps({
  images: {
    type: Array,
    default: () => [{ url: "/image-placeholder.jpg", alt: "Placeholder image", id: "placeholder" }]
  }
});

const noImage = props.images.length === 1 && props.images[0].id === "placeholder";
const currentImage = ref();
const currentImageIndex = ref();
const slider = ref();
const scrolledMaxLeft = ref(true);
const scrolledMaxRight = ref(true);

const moveSlider = (index) => {
  if (slider.value) {
    const imageCount = slider.value.children.length;
    const imageWidth = slider.value.children[0].clientWidth;
    const scrollMaxWidth = slider.value.scrollWidth;
    const sliderWidth = slider.value.clientWidth;
    const scrollLeftMax = scrollMaxWidth - sliderWidth;
    const spacing = (scrollMaxWidth - imageCount * imageWidth) / imageCount;
    const imageWithSpacing = imageWidth + spacing;

    slider.value.scrollLeft = Math.round(
      index * imageWithSpacing - sliderWidth / 2 + imageWithSpacing / 2
    );

    if (sliderWidth < scrollMaxWidth) {
      scrolledMaxLeft.value = slider.value.scrollLeft === 0;
      scrolledMaxRight.value = scrollLeftMax === slider.value.scrollLeft;
    }
  }
};
const selectImage = (index) => {
  currentImage.value = props.images[index];
  currentImageIndex.value = index;

  moveSlider(index);
};

const tabSlider = (event, index) => {
  const isTabPressed = event.key === "Tab";

  if (event.shiftKey && isTabPressed) {
    moveSlider(index - 1);
  } else if (isTabPressed) {
    moveSlider(index + 1);
  }
};

const nextImage = debounce(() => {
  let newIndex = currentImageIndex.value + 1;
  if (props.images.length - 1 < newIndex) {
    newIndex = 0;
  }
  selectImage(newIndex);
}, 100);

const previousImage = debounce(() => {
  let newIndex = currentImageIndex.value - 1;
  if (currentImageIndex.value === 0) {
    newIndex = props.images.length - 1;
  }

  selectImage(newIndex);
}, 100);

selectImage(0);

onMounted(() => {
  moveSlider(currentImageIndex);
});
</script>

<template>
  <div class="space-y-2">
    <div class="aspect-h-2 aspect-w-3 relative">
      <div
        class="rounded bg-cover bg-center"
        :style="{ backgroundImage: 'url(' + currentImage.url + ')' }"
      >
        <div class="absolute inset-0 rounded bg-grey-200/80 backdrop-blur-lg"></div>
        <button
          v-if="images.length > 1"
          class="absolute inset-y-0 left-5 z-20 my-auto grid h-9 w-7 place-items-center rounded bg-black/75 text-white shadow-sm outline-none transition-all duration-150 hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:bg-black"
          @click="previousImage"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon class="h-6 w-6" />
        </button>
        <button
          v-if="images.length > 1"
          class="absolute inset-y-0 right-5 z-20 my-auto grid h-9 w-7 place-items-center rounded bg-black/75 text-white shadow-sm outline-none transition-all duration-150 hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:bg-black"
          @click="nextImage"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon class="h-6 w-6" />
        </button>
        <div
          v-if="!noImage"
          class="absolute inset-x-0 bottom-5 z-20 mx-auto grid h-7 w-9 place-items-center rounded bg-black/75 text-white shadow-sm transition-all"
        >
          {{ currentImageIndex + 1 }}/{{ images.length }}
        </div>
        <img
          class="relative z-10 mx-auto h-full object-contain shadow-sm shadow-black/10"
          :src="currentImage.url"
          :alt="currentImage.alt"
          onerror="this.onerror=null;this.src='/image-placeholder.jpg';"
        />
      </div>
    </div>

    <div class="relative" v-if="!noImage">
      <ul
        ref="slider"
        class="no-scrollbar mx-auto flex w-full gap-5 overflow-x-auto rounded px-3 outline-none focus-visible:ring-1 focus-visible:ring-black"
        :class="{
          'before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-30 before:h-full  before:w-10 before:bg-gradient-to-r before:from-white/95':
            !scrolledMaxLeft,
          'after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-30 after:h-full  after:w-10 after:bg-gradient-to-l after:from-white/95':
            !scrolledMaxRight
        }"
      >
        <li
          class="flex h-full w-[125px] flex-shrink-0 py-3"
          v-for="(image, index) in images"
          :key="image.id"
        >
          <button
            :class="{
              '  relative scale-110 brightness-100 after:absolute after:inset-0 after:rounded after:border-2 after:border-black/10':
                index === currentImageIndex,
              ' brightness-75': index !== currentImageIndex
            }"
            class="aspect-h-3 aspect-w-4 h-full w-full outline-none transition-all duration-150 after:rounded hover:brightness-100 focus-visible:brightness-100 focus-visible:after:absolute focus-visible:after:inset-0 focus-visible:after:z-10 focus-visible:after:border-2 focus-visible:after:border-black focus-visible:after:inner-border-2 focus-visible:after:inner-border-white/85"
            aria-label="Image"
            @click="selectImage(index)"
            @keydown="tabSlider($event, index)"
          >
            <span class="sr-only">Select image: {{ image.alt }}</span>
            <img
              class="rounded object-cover"
              :src="image.url"
              :alt="image.alt"
              onerror="this.onerror=null;this.src='/image-placeholder.jpg';"
            />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
