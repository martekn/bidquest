<script setup>
defineProps({
  url: { type: String, default: "/avatar-placeholder.jpg" },
  alt: { type: String, default: "" }
});
</script>
<template>
  <div
    class="relative after:absolute after:inset-0 after:rounded after:border-2 after:border-black/10"
  >
    <img
      class="zz- relative h-full w-full rounded object-cover"
      :src="url"
      :alt="alt"
      onerror="this.onerror=null;this.src='/avatar-placeholder.jpg';"
    />
  </div>
</template>
