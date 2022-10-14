<template>
  <div
    class="border-2 p-2 rounded mt-2 hover:bg-slate-200 dark:hover:bg-slate-900"
  >
    <h3
      v-on:click="isAccordionOpen = !isAccordionOpen"
      class="p-4 font-bold text-left rounded cursor-pointer"
    >
      {{ title }}
    </h3>
    <div
      class="mt-4 border-2 py-8 text-center items-center justify-center rounded bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-50"
      :class="isAccordionOpen ? 'md:flex block' : 'hidden'"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      isAccordionOpen: false,
    };
  },
  name: "Accordion",
  props: {
    title: String,
  },
};
</script>
