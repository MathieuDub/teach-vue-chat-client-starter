<template>
  <div class="message">
    <img
        :title= from
        :src= picture
    />
    <div class="bubble top bottom">{{ message }}</div>
    <div class="reacts"></div>
    <div class="controls">
      <i title="Répondre" class="circular reply icon"></i
      ><span class="react"
    ><i title="Aimer" class="circular heart outline icon"></i
    ><i
        title="Pouce en l'air"
        class="circular thumbs up outline icon"
    ></i
    ><i title="Content" class="circular smile outline icon"></i
    ><i
        title="Pas content"
        class="circular frown outline icon"
    ></i
    ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheirMessage",
  props: ["message", "from", "picture"],
  data() {
    return {
      
    };
  }
}
</script>

<style src="./Conversation.css" scoped />
