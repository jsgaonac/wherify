<script setup lang="ts">

import {computed, ref} from 'vue';
import {useClipboard} from '@vueuse/core';

const {copy} = useClipboard();
const showCopied = ref(false);

const inputDataValue = ref('');
const outputDataValue = ref('');

const duplicateChecked = ref(true);
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

function onDuplicateChange(event: Event) {
  duplicateChecked.value = (event.target as HTMLInputElement).checked;
}

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

function removeDuplicates(words: string[]) {
  const wordCount: {[k: string]: number} = {};
  const uniqueWords: string[] = [];

  for (const word of words) {
    if (!wordCount[word]) {
      wordCount[word] = 1;
      uniqueWords.push(word);
    }
  }

  return uniqueWords;
}

function doTransform() {
  if (!inputDataValue.value) return;

  let words = (inputDataValue.value ?? '')
      .trim()
      .split(/\s+/)
      .filter(a => a !== ',');

  if (duplicateChecked.value) {
    words = removeDuplicates(words);
  }

  const surroundingChar = isSingleQuoteChecked.value ? "'" : (
      isDoubleQuoteChecked.value ? '"' : ''
  );

  const transformedWords = words.map(a => `  ${surroundingChar}${a}${surroundingChar}`)
      .join(',\n');

  outputDataValue.value = isParenthesisClosureChecked.value ? `(\n${transformedWords}\n)` : `[\n${transformedWords}\n]`;
}

function doCopy(data: string) {
  copy(data);

  if (showCopied.value) return;

  showCopied.value = true;

  setTimeout(() => {
    showCopied.value = false;
  }, 5000);
}

</script>

<template>
  <header>
    <h1>Wherify</h1>
  </header>

  <main>
    <section class="data">
      <textarea rows="20" class="input-data" v-model="inputDataValue" placeholder="Paste your data here."></textarea>
      <textarea rows="20" class="output-data" :value="outputDataValue" placeholder="Output goes here."></textarea>
    </section>

    <section class="options">
      <div class="option">
        <h2>Data</h2>
        <div class="values">
          <label for="remove-duplicates">
            <input type="checkbox" name="remove-duplicates" id="remove-duplicates" :checked="duplicateChecked" @change="onDuplicateChange">
            Remove duplicates
          </label>
        </div>
      </div>
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
      <button @click="doTransform">Transform</button>
      <div class="copied-wrapper">
        <button @click="doCopy(outputDataValue)">Copy output</button>
        <span :class="{ show: showCopied, copied: true }">Copied</span>
      </div>
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

.actions > *:not(:first-child) {
  margin-left: 1rem;
}

.copied-wrapper {
  position: relative;
}

.copied {
  color: palevioletred;
  font-weight: bold;
  margin-left: 1rem;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  transition: opacity 0.5s;
}

.copied.show {
  opacity: 1;
}
</style>
