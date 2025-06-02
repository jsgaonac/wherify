<script setup lang="ts">
</script>

<template>
  <header>
    <h1>Wherify</h1>
  </header>

  <main>
    <section class="data">
      <textarea rows="20" class="input-data" placeholder="Paste your data here."></textarea>
      <textarea rows="20" class="output-data" placeholder="Output goes here."></textarea>
    </section>
  </main>
</template>

<style scoped>
h1 {
  font-size: 3.2rem;
  font-weight: bold;
  margin: 1rem 0;
}

section.data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-width: 75vw;
}

textarea {
  background-color: var(--color-background);
  color: #fff;
}
</style>
