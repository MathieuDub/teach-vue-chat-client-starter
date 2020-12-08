import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticating: false,
    user: {
      username: null,
      token: null,
      picture_url: null
    },
    users: [],
    conversations: [],
    currentConversationId: null,
    usersAvailable: []
  },
  getters: {
    authenticating(state) {
      return state.authenticating;
    },
    authenticated(state) {
      return state.user.token !== null;
    },
    user(state) {
      return state.user;
    },
    users(state) {
      return state.users.map(user => ({
        ...user
        //TODO
      }));
    },
    conversations(state) {
      state.conversations.sort(( a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      return state.conversations.map(conversation => ({
        ...conversation
        //TODO
      }));
    },
    conversation(state, getters) {
      let conver;
      state.conversations.forEach(conversation => {
        if (conversation.id === state.currentConversationId) {
          conver = conversation;
        }
      });
      return conver;
    }
  },
  mutations: {
    syncCurrentConversation(state, conversationId) {
      state.currentConversationId = conversationId;
    },
    setAuthenticating(state, authenticating) {
      state.authenticating = authenticating;
    },
    setUser(state, { username, token, picture_url }) {
      Vue.set(state.user, "username", username);
      Vue.set(state.user, "token", token);
      Vue.set(state.user, "picture_url", picture_url);
    },
    setUsers(state, users) {
      state.users = users;
    },

    upsertUser(state, { user }) {
      const localUserIndex = state.users.findIndex(
        _user => _user.username === user.username
      );

      if (localUserIndex !== -1) {
        Vue.set(state.users, localUserIndex, user);
      } else {
        state.users.push({
          ...user
        });
      }
    },

    upsertConversation(state, { conversation }) {
      conversation.title=conversation.participants.join();
      state.conversations.push(conversation);
    },
    loadConversations(state, conversations){
      conversations.forEach((conversation) => {
        conversation.title = conversation.participants.join();
      });
      state.conversations = conversations;
    },
    upsertConversationMessages(state, { conversation_id, message }) {
      state.conversations.forEach(conversation => {
        if (conversation.id === conversation_id) {
          console.log(message);
          conversation.messages.push(message);
        }
      });
    }
  },
  actions: {
    authenticate({ commit, dispatch }, { username, password }) {
      if (!username || !password) {
        return;
      }
      commit("setAuthenticating", true);
      Vue.prototype.$client
        .authenticate(username, password)
        .then(user => {
          commit("setUser", user);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);

          dispatch("initializeAfterAuthentication");
        })
        .catch(() => {
          alert("Erreur d'authentification !");
        })
        .finally(() => {
          commit("setAuthenticating", false);
        });
    },

    deauthenticate() {
      localStorage.removeItem("password");
      window.location.reload();
    },

    initializeAfterAuthentication({ dispatch }) {
      dispatch("fetchUsers");
      //TODO: dispatch("fetchConversations");
    },

    fetchUsers({ commit }) {
      Vue.prototype.$client.getUsers().then(({ users }) => {
        commit("setUsers", users);
      });
    },

    createOneToOneConversation({ commit }, username) {
      const promise = Vue.prototype.$client.getOrCreateOneToOneConversation(
        username
      );

      promise.then(({ conversation }) => {
        //commit("upsertConversation", {
        //  conversation
        // });

        router.push({
          name: "Conversation",
          params: { id: conversation.id }
        });
      });

      return promise;
    },

    createManyToManyConversation({ commit }, username) {
      const promise = Vue.prototype.$client.createManyToManyConversation(
        username
      );

      promise.then(({ conversation }) => {
        //commit("upsertConversation", {
        //  conversation
        //});

        router.push({
          name: "Conversation",
          params: { id: conversation.id }
        });
      });

      return promise;
    },
    initConversations({ commit }){
      const promise = Vue.prototype.$client.getConversations();
      promise.then(({ conversations }) => {
        commit("loadConversations", conversations);
      });
      return promise;
    },
    postMessage({ commit }, { currentConversationId, message }) {
      const promise = Vue.prototype.$client.postMessage(
        currentConversationId,
        message
      );
      promise.then(({ conversation_id, content }) => {
        commit("upsertConversationMessages", { conversation_id, content });
      });
    }
  }
});
