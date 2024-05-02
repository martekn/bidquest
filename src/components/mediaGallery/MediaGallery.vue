<script setup>
// #region -IMPORTS-
// Vue-related imports
import { onMounted, ref } from "vue";

// Third-party library imports
import { ChevronRightIcon, ChevronLeftIcon, XMarkIcon } from "@heroicons/vue/20/solid";
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
import MediaGalleryCounter from "@/components/mediaGallery/MediaGalleryCounter.vue";
import MediaGalleryButton from "@/components/mediaGallery/MediaGalleryButton.vue";

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
const isGalleryOpen = ref(false);
const panel = ref();

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
        class="overflow-hidden rounded bg-cover bg-center"
        :style="{ backgroundImage: 'url(' + currentImage.url + ')' }"
      >
        <div class="absolute inset-0 rounded bg-grey-200/80 backdrop-blur-lg"></div>
        <MediaGalleryButton
          @click="previousImage"
          class="inset-y-0 left-5 h-9 w-7"
          sr-text="Previous"
          :show="images.length > 1"
        >
          <ChevronLeftIcon class="h-6 w-6" />
        </MediaGalleryButton>
        <MediaGalleryButton
          @click="nextImage"
          class="inset-y-0 right-5 h-9 w-7"
          sr-text="Next"
          :show="images.length > 1"
        >
          <ChevronRightIcon class="h-6 w-6" />
        </MediaGalleryButton>

        <MediaGalleryCounter
          :currentImage="currentImageIndex + 1"
          :imagesCount="images.length"
          :show="!noImage"
        />

        <img
          v-if="noImage"
          class="relative z-10 mx-auto h-full object-contain shadow-sm shadow-black/10"
          :src="currentImage.url"
          :alt="currentImage.alt"
          onerror="this.onerror=null;this.src='/image-placeholder.jpg';"
        />

        <button
          v-else
          @click="() => (isGalleryOpen = true)"
          class="relative z-10 h-full w-full focus-visible:inner-border-2 focus-visible:inner-border-black"
        >
          <img
            class="mx-auto h-full object-contain shadow-sm shadow-black/10"
            :src="currentImage.url"
            :alt="currentImage.alt"
            onerror="this.onerror=null;this.src='/image-placeholder.jpg';"
          />
        </button>
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
              'image-border-overlay scale-110 brightness-100 ': index === currentImageIndex,
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

    <TransitionRoot as="template" :show="isGalleryOpen">
      <Dialog
        :open="isGalleryOpen"
        @close="() => (isGalleryOpen = false)"
        :initialFocus="panel"
        class="relative z-50"
      >
        <div class="fixed inset-0 flex w-screen items-center justify-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-200"
            enter-from="opacity-0 "
            enter-to="opacity-100 "
            leave="ease-in duration-100"
            leave-from="opacity-100 "
            leave-to="opacity-0 "
          >
            <DialogPanel
              ref="panel"
              class="z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black p-5 shadow-md shadow-black/10 md:p-6"
            >
              <div class="flex h-full w-full flex-col">
                <button
                  @click="() => (isGalleryOpen = false)"
                  class="mb-6 ml-auto grid h-6 w-6 place-items-center rounded text-white shadow-sm outline-none transition-all duration-150 hover:text-grey-300 active:text-grey-400 ui-focus-visible:ring-1 ui-focus-visible:ring-white ui-focus-visible:ring-offset-2"
                >
                  <span class="sr-only">close</span>
                  <XMarkIcon class="h-6 w-6" />
                </button>
                <div class="relative flex h-full overflow-hidden">
                  <MediaGalleryButton
                    @click="previousImage"
                    class="inset-y-0 left-1 h-10 w-8"
                    sr-text="Previous"
                    :show="images.length > 1"
                  >
                    <ChevronLeftIcon class="h-8 w-8" />
                  </MediaGalleryButton>
                  <MediaGalleryButton
                    @click="nextImage"
                    class="inset-y-0 right-1 h-10 w-8"
                    sr-text="Next"
                    :show="images.length > 1"
                  >
                    <ChevronRightIcon class="h-8 w-8" />
                  </MediaGalleryButton>
                  <MediaGalleryCounter
                    :currentImage="currentImageIndex + 1"
                    :imagesCount="images.length"
                    :show="!noImage"
                  />
                  <div
                    class="flex h-full w-full items-center justify-center overflow-hidden rounded"
                  >
                    <img
                      @click="() => (isGalleryOpen = true)"
                      class="h-full rounded object-contain"
                      :src="currentImage.url"
                      :alt="currentImage.alt"
                      onerror="this.onerror=null;this.src='/image-placeholder.jpg';"
                    />
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
