<template>
  <div class="community">
    <div class="filter">
      <div class="ui fluid search">
        <div class="ui icon input">
          <input
            v-model="search"
            class="prompt"
            type="text"
            placeholder="Rechercher un utilisateur"
          />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
    </div>
    <div class="users">
      <div v-for="(user,index) in search_users" :key="user.username" :ref="user.username" :class="{ user, selected:users_selected.includes(user.username)?true : false }"  @click="user_selected(user.username,index)">
        <img :src=user.picture_url  />
        <span class="">{{ user.username }}</span>
      </div>
    </div>

    <div class="actions" v-show="users_selected.length>=1">
      <button class="ui primary big button" @click="openConversation">
        <i class="conversation icon"></i>
        <span>
          Ouvrir une conversation ({{users_selected.length}})
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Community",
  data() {
    return {
      search: "",
      users_selected: []
    };
  },
  methods: {
    ...mapActions(["createOneToOneConversation","createManyToManyConversation"]),
    openConversation() {
      if(this.users_selected.length > 1 ){
        let promise = this.createManyToManyConversation(this.users_selected);
        promise.finally(() => {
          console.log("Conversation ouverte !");
        });
      }else {
        let promise = this.createOneToOneConversation(this.users_selected[0]);

        promise.finally(() => {
          console.log("Conversation ouverte !");
        });
      }
    },
    user_selected(username,index){
      if(this.users_selected.includes(username)){
        this.users_selected.splice(this.users_selected.indexOf(username),1)
      }else{
      this.users_selected.push(username)
      }
      //this.$refs[username][0].className += " selected";
    }
  },
  computed: {
    ...mapGetters(["users"]),
    search_users(){
      let filteredUsers;
      filteredUsers = this.users.filter((todo) =>
        todo.username.toLowerCase().includes(this.search.toLowerCase())
      );

      return filteredUsers;
    }
  }
};
</script>

<style src="./Community.css" scoped />
