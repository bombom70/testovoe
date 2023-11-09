<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { debounce } from '../utils';

const name = ref('');
const users = ref([]);
const isOpen = ref(true);
const isLoading = ref(false);

const openDropDown = () => {
  if (!users.value.length) return;
  isOpen.value = !isOpen.value;
}

const handleInput = ({ target }) => {
  name.value = target.value.trim();
}

const selectName = (login) => {
  name.value = login;
}

const debouncedHandle = debounce(handleInput, 350);


watch(name, async () => {
  if (!name.value.length) {
    users.value = [];
    return; 
  }
  isLoading.value = true;
  const { data } = await axios(`https://api.github.com/search/users?q=${name.value}`);
  users.value = data.items;
  isLoading.value = false;
  console.log(data.items);
});
</script>

<template>
  <form @submit.prevent class="search">
    <div class="search__wrapper">
      <input
        class="search__input"
        type="text"
        name="input-name"
        autocomplete="off"
        :value="name"
        @input="debouncedHandle"
      />
      <span class="loader" v-show="isLoading"></span>
      <button
        @click="openDropDown"
        class="search__open-btn"
        :class="{'isOpen': isOpen}"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.64645 8.64645C5.84171 8.45118 6.15829 8.45118 6.35355 8.64645L12 14.2929L17.6464 8.64645C17.8417 8.45118 18.1583 8.45118 18.3536 8.64645C18.5488 8.84171 18.5488 9.15829 18.3536 9.35355L12.3536 15.3536C12.1583 15.5488 11.8417 15.5488 11.6464 15.3536L5.64645 9.35355C5.45118 9.15829 5.45118 8.84171 5.64645 8.64645Z" fill="#262626"/>
      </svg>
      </button>
    </div>
    <div class="search__dropdown" v-show="isOpen">
      <ul class="search__items">
        <li
          v-for="u in users"
          :key="u.id"
          class="search__item"
          @click="selectName(u.login)"
        >
        <a href="#">
          {{ u.login }}
        </a>
        </li>
      </ul>
    </div>
  </form>
</template>
<style scoped>
.search {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  z-index: 1;
}
.search__input {
  width: 100%;
  height: 100%;
  border: 1px solid #FFC700;
  border-radius: 4px;
  padding: 0 8px;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}

.search__input:focus {
  outline: #FFC700;
  border-color: #FFC700;
}

li {
  list-style: none;
}
.search__open-btn {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 100%;
  right: 0px;
  border: none;
  background: border-box;
  cursor: pointer;
  box-sizing: border-box;
}

.search__dropdown {
  position: relative;
  top: -5px;
  background: white;
}

.search__item {
  padding: 8px;
  color: black;
  cursor: pointer;
}
.search__item:hover {
  background: rgba(255, 201, 4, 0.17);
}
.isOpen {
  transform: rotate(180deg);
}

.loader {
  position: absolute;
  width: 16px;
  height: 16px;
  right: 60px;
  border: 1px solid #FFC700;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>