<template>
  <div class="group">
    <div class="ui fluid search">
      <div class="ui icon input">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un utilisateur"
          class="prompt"
        /><i class="search icon"></i>
      </div>
    </div>
    <div class="spanner">
      <hr />
      <span>Participants</span>
      <hr />
    </div>
    <div v-for="user in conversation.participants" :key="user" class="user">
      <img :src="getPicture(user)" />
      <span>{{ user }}<br /><i class="nickname"></i> </span>
      <i title="Modifier le surnom" class="circular quote left link icon"> </i>
      <i
        v-if="conversation.participants.length > 3"
        title="Enlever de la conversation"
        class="circular times icon link"
        style=""
        @click="delParticipant(user)"
      ></i>
    </div>
    <div class="spanner">
      <hr />
      <span>Communauté</span>
      <hr />
    </div>
    <div v-for="user in community" :key="user.username" class="user">
      <img :src="user.picture_url" /><span>{{ user.username }}</span>
      <i
        title="Ajouter à la conversation"
        class="circular plus icon link"
        @click="addParticipant(user.username)"
      ></i>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Group",
  data() {
    return {
      search: ""
    };
  },
  created() {},
  computed: {
    ...mapGetters(["conversation", "users"]),
    community() {
      let communityUsers = [];
      this.users.forEach(user => {
        if (!this.conversation.participants.includes(user.username)) {
          communityUsers.push(user);
        }
      });
      return communityUsers;
    }
  },
  methods: {
    ...mapActions(["addParticipant", "delParticipant"]),
    getPicture(name) {
      let picture;
      this.users.forEach(user => {
        if (user.username === name) {
          picture = user.picture_url;
        }
      });
      return picture;
    }
  }
};
</script>

<style src="./Group.css" scoped />
