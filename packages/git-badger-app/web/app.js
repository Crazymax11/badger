import Vue from 'vue';
import vueCustomElement from 'vue-custom-element';
import ElementUI from 'element-ui';
import VueClipboard from 'vue-clipboard2';
import Badge from './components/simple-badge.vue';
import BadgeShield from './components/badge-shield.vue';
import LastActivities from './components/last-activities.vue';
import TestBadgeForm from './components/test-badge-form.vue';

Vue.use(ElementUI);
Vue.use(vueCustomElement);
Vue.use(VueClipboard);
Vue.customElement('simple-badge', Badge);
Vue.customElement('badge-shield', BadgeShield);
Vue.customElement('last-activities', LastActivities);
Vue.customElement('test-badge-form', TestBadgeForm);
