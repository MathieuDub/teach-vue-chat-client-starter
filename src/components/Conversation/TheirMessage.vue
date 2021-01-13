<template>
  <div class="message">
    <img :title="from" :src="picture" />
    <div class="bubble top bottom">{{ message.content }}</div>
    <div class="reacts">
      <i v-show="countHeart > 0" title="Aimer" class="circular heart outline icon">{{ countHeart }}</i>
      <i v-show="countThumb > 0" title="Pouce en l'air" class="circular thumbs up outline icon">{{ countThumb }}</i>
      <i v-show="countHappy > 0" title="Content" class="circular smile outline icon">{{ countHappy }}</i>
      <i v-show="countSad > 0" title="Pas content" class="circular frown outline icon">{{ countSad }}</i>
    </div>
    <div class="controls">
      <i class="circular reply icon" title="Répondre" @click="addReply({message_id: message.id, message_content: message.content})"></i>
      <span class="react">
        <i
          class="circular heart outline icon"
          title="Aimer"
          @click="addReact({ message_id: message.id, reaction: 'HEART' })"
        ></i>
        <i
          class="circular thumbs up outline icon"
          title="Pouce en l'air"
          @click="addReact({ message_id: message.id, reaction: 'THUMB' })"
        ></i>
        <i
          class="circular smile outline icon"
          title="Content"
          @click="addReact({ message_id: message.id, reaction: 'HAPPY' })"
        ></i>
        <i
          class="circular frown outline icon"
          title="Pas content"
          @click="addReact({ message_id: message.id, reaction: 'SAD' })"
        ></i
      ></span>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  // THUMB HEART HAPPY SAD
  name: "TheirMessage",
  props: ["message", "from", "picture"],
  created() {
    console.log(this.message);
  },
  data() {
    return {

    };
  },
  methods: {
    ...mapActions(["addReact", "addReply"])
  },
  computed: {
    countHeart() {
      let count = 0;
      Object.values(this.message.reactions).forEach((react) => {
        if(react === 'HEART') {
          count++;
        }
      })
      return count;
    },
    countThumb() {
      let count = 0;
      Object.values(this.message.reactions).forEach((react) => {
        if(react === 'THUMB') {
          count++;
        }
      })
      return count;
    },
    countHappy() {
      let count = 0;
      Object.values(this.message.reactions).forEach((react) => {
        if(react === 'HAPPY') {
          count++;
        }
      })
      return count;
    },
    countSad() {
      let count = 0;
      Object.values(this.message.reactions).forEach((react) => {
        if(react === 'SAD') {
          count++;
        }
      })
      return count;
    },
  }
};
</script>

<style src="./Conversation.css" scoped />
