<template>
  <main class="h-full bg-straws-pattern">
    <div class="mx-auto max-w-8xl px-5 pb-10 pt-12 md:pb-12">
      <h1 class="font-accent text-5xl font-semibold leading-tight md:text-6xl">
        Oops! Page Not Found
      </h1>
      <span class="text-xs text-grey-500">Error: 404 Not found</span>
      <p class="mt-5 max-w-xl font-medium text-grey-500">
        We’re sorry, but the page you’re looking for doesn’t seem to exist. It might have been
        moved, renamed, or it may never have existed. You can go back to our homepage or continue
        browsing other exciting auctions.
      </p>
      <div class="mt-7 flex w-fit gap-5 md:gap-6">
        <RouterLink to="/" class="link link-secondary">Home</RouterLink>
        <RouterLink to="/auctions" class="link link-secondary">Explore</RouterLink>
        <RouterLink to="/auction/create" class="link link-secondary">Create</RouterLink>
      </div>
    </div>
  </main>
</template>
