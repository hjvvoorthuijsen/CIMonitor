import Vue from 'vue';
import VueSocketIo from 'vue-socket.io-extended';
import io from 'socket.io-client';
import Vuex from 'vuex';

import Dashboard from './components/Dashboard';
import Store from './store';
import socketEvents from '../shared/socketEvents';
import { STATUS_SET_STATUSES } from './store/StaticMutations';
import { STATUS_GET_GLOBAL_STATE } from './store/StaticGetters';

Vue.use(VueSocketIo, io());
Vue.use(Vuex);

Vue.component(`dashboard`, Dashboard);

new Vue({
    el: '#app',
    store: Store,
    data() {
        return {
            isConnected: false,
        };
    },
    methods: {
        updateFavicon(globalState) {
            document
                .querySelector('link[rel="shortcut icon"]')
                .setAttribute('href', `/images/favicon/${globalState}.png`);
        },
    },
    sockets: {
        connect() {
            console.log('Socket connected.');
            this.isConnected = true;
        },
        disconnect() {
            console.log('Socket disconnected :(');
            this.isConnected = false;
        },
        [socketEvents.statusesUpdated](statuses) {
            this.$store.commit(STATUS_SET_STATUSES, statuses);

            this.updateFavicon(this.$store.getters[STATUS_GET_GLOBAL_STATE]);
        },
    },
});
