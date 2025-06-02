<script setup lang="ts">

import {computed, ref} from 'vue';

const currentSeparator = ref('single');
const currentClosure = ref('parens');

const isSingleQuoteChecked = computed(() => {
  return currentSeparator.value === 'single';
});

const isDoubleQuoteChecked = computed(() => {
  return currentSeparator.value === 'double';
});

const isParenthesisClosureChecked = computed(() => currentClosure.value === 'parens');
const isSquareBracketsClosureChecked = computed(() => currentClosure.value === 'square');

function onSeparatorChange(type: string) {
  if (type === currentSeparator.value) {
    currentSeparator.value = '';

    return;
  }

  currentSeparator.value = type;
}

function onClosureChange(type: string) {
  if (type === currentClosure.value) {
    currentClosure.value = '';

    return;
  }

  currentClosure.value = type;
}

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

    <section class="options">
      <div class="option">
        <h2>Separator</h2>
        <div class="values">
          <label for="single-quote">
            <input type="checkbox" name="single-quote" id="single-quote" :checked="isSingleQuoteChecked" @change="onSeparatorChange('single')">
            Single quote ('')
          </label>
          <label for="double-quote">
            <input type="checkbox" name="double-quote" id="double-quote" :checked="isDoubleQuoteChecked" @change="onSeparatorChange('double')">
            Double quote ("")
          </label>
        </div>
      </div>
      <div class="option">
        <h2>Closure</h2>
        <div class="values">
          <label for="parenthesis">
            <input type="checkbox" name="parenthesis-closure" id="parenthesis-closure" :checked="isParenthesisClosureChecked" @change="onClosureChange('parens')">
            Parenthesis ()
          </label>
          <label for="square-closure">
            <input type="checkbox" name="square-closure" id="square-closure" :checked="isSquareBracketsClosureChecked" @change="onClosureChange('square')">
            Square brackets []
          </label>
        </div>
      </div>
    </section>

    <section class="actions">
      <button>Transform</button>
      <button>Copy output</button>
    </section>
  </main>
</template>

<style scoped>
h1 {
  font-size: 3.2rem;
  font-weight: bold;
  margin: 1rem 0;
}

h2 {
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
}

section.data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-width: 75vw;
}

section.options > .option {
  justify-content: center;
  margin-top: 1rem;
}

.option > .values {
  display: flex;
  justify-content: center;
}
.option > .values > *:not(:first-child) {
  margin-left: .5rem;
}
.option > h2 {
  margin-bottom: .5rem;
}

textarea {
  background-color: var(--color-background);
  color: #fff;
}

section.actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.actions > button:not(:first-child) {
  margin-left: 1rem;
}
</style>
