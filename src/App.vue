<script setup lang="ts">

import {computed, ref} from 'vue';
import {useClipboard} from '@vueuse/core';

const {copy} = useClipboard();
const showCopied = ref(false);

const inputDataValue = ref('');
const outputDataValue = ref('');

const duplicateChecked = ref(true);
const currentWrapWith = ref('single');
const currentClosure = ref('parens');
const isSpaceSplitChecked = ref(true);
const isNewlineSplitChecked = ref(false);
const isWrapInLineSplitChecked = ref(false);
const isWrapInLineParseChecked = ref(true);
const isWrapInLineNoParsingChecked = ref(false);

const isSingleQuoteChecked = computed(() => {
  return currentWrapWith.value === 'single';
});

const isDoubleQuoteChecked = computed(() => {
  return currentWrapWith.value === 'double';
});

const isParenthesisClosureChecked = computed(() => currentClosure.value === 'parens');
const isSquareBracketsClosureChecked = computed(() => currentClosure.value === 'square');

function onDuplicateChange(event: Event) {
  duplicateChecked.value = (event.target as HTMLInputElement).checked;
}

function onWrapWithChange(type: string) {
  if (type === currentWrapWith.value) {
    currentWrapWith.value = '';

    return;
  }

  currentWrapWith.value = type;
}

function onClosureChange(type: string) {
  if (type === currentClosure.value) {
    currentClosure.value = '';

    return;
  }

  currentClosure.value = type;
}

function onSplitChange(type: 'space' | 'newline' | 'wrap-in-line') {
  isSpaceSplitChecked.value = type === 'space';
  isNewlineSplitChecked.value = type === 'newline';
  isWrapInLineSplitChecked.value = type === 'wrap-in-line';
}

function onParseChange(event: 'parse' | 'no-parse') {
  isWrapInLineParseChecked.value = event === 'parse';
  isWrapInLineNoParsingChecked.value = event === 'no-parse';
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
      .split(isSpaceSplitChecked.value ? /\s+/ : /\n+/) // Split on a newline works for both nweline and wrap-in-line
      .filter(a => a !== ',');

  if (duplicateChecked.value) {
    words = removeDuplicates(words);
  }

  const surroundingChar = isSingleQuoteChecked.value ? "'" : (
      isDoubleQuoteChecked.value ? '"' : ''
  );

  let transformedWords: string;
  const openWrapper = isParenthesisClosureChecked.value ? '(' : '[';
  const closeWrapper = isParenthesisClosureChecked.value ? ')' : ']';

  if (isWrapInLineSplitChecked.value) {
    transformedWords = transformWrapInLine(words, surroundingChar, openWrapper, closeWrapper);
  } else {
    transformedWords = words.map(a => `  ${surroundingChar}${a}${surroundingChar}`)
        .join(',\n');

    transformedWords = `${openWrapper}\n${transformedWords}\n${closeWrapper}`;
  }

  outputDataValue.value = transformedWords;
}

function doCopy(data: string) {
  copy(data);

  if (showCopied.value) return;

  showCopied.value = true;

  setTimeout(() => {
    showCopied.value = false;
  }, 5000);
}

function transformWrapInLine(words: string[], surroundingChar: string, openWrapper: string, closeWrapper: string): string {
  const linesOfWords =  words.map(a => a.split(/\s+/));

  const transformedLines: string[] = [];

  for (const l of linesOfWords) {
    transformedLines.push(`${openWrapper}${l.map(a => {
      let parseSuccess = false;

      if (isWrapInLineParseChecked.value) {
        let parsed = parseInt(a, 10);

        if (!isNaN(parsed)) {
          parseSuccess = true;
        } else {
          parsed = parseFloat(a);

          parseSuccess = !isNaN(parsed);
        }
      }

      return parseSuccess ? a : `${surroundingChar}${a}${surroundingChar}`;
    }).join(', ')}${closeWrapper}`);
  }

  return transformedLines.join(',\n');
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
        <h2>Split on</h2>
        <div class="values">
          <label for="split-space">
            <input type="checkbox" name="split-space" id="split-space" v-model="isSpaceSplitChecked" @change="onSplitChange('space')">
            Space
          </label>
          <label for="split-newline">
            <input type="checkbox" name="split-newline" id="split-newline" v-model="isNewlineSplitChecked" @change="onSplitChange('newline')">
            Newline
          </label>
          <label for="split-wrap-line">
            <input type="checkbox" name="split-wrap-line" id="split-wrap-line" v-model="isWrapInLineSplitChecked" @change="onSplitChange('wrap-in-line')">
            Wrap-in-line
          </label>
        </div>
      </div>
      <div class="option" v-if="isWrapInLineSplitChecked">
        <h2>Wrap-in-line options</h2>
        <div class="values">
          <label for="wrap-in-line-parsing">
            <input type="checkbox" name="wrap-in-line-parsing" id="wrap-in-line-parsing" v-model="isWrapInLineParseChecked" @change="onParseChange('parse')">
            Parse
          </label>
          <label for="wrap-in-line-no-parsing">
            <input type="checkbox" name="wrap-in-line-no-parsing" id="wrap-in-line-no-parsing" v-model="isWrapInLineNoParsingChecked" @change="onParseChange('no-parse')">
            All strings
          </label>
        </div>
      </div>
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
        <h2>Wrap with</h2>
        <div class="values">
          <label for="single-quote">
            <input type="checkbox" name="single-quote" id="single-quote" :checked="isSingleQuoteChecked" @change="onWrapWithChange('single')">
            Single quote ('')
          </label>
          <label for="double-quote">
            <input type="checkbox" name="double-quote" id="double-quote" :checked="isDoubleQuoteChecked" @change="onWrapWithChange('double')">
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
