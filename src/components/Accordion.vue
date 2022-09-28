<template>
  <div class="border-2 p-2 rounded mt-2">
    <h3
      v-on:click="isAccordionOpen = !isAccordionOpen"
      class="p-4 font-bold text-left rounded cursor-pointer"
    >
      {{ title }}
    </h3>
    <div
      class="mt-4 border-2 p-2 rounded"
      :class="isAccordionOpen ? 'block' : 'hidden'"
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
