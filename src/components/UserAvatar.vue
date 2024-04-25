<script setup>
defineProps({
  url: { type: String, default: "/avatar-placeholder.jpg" },
  alt: { type: String, default: "" }
});
</script>
<template>
  <div class="image-border-overlay">
    <img
      class="relative h-full w-full rounded bg-grey-300 object-cover"
      :src="url"
      :alt="alt"
      onerror="this.onerror=null;this.src='/avatar-placeholder.jpg';"
    />
  </div>
</template>
