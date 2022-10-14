import { writable } from 'svelte/store';

export const selectedServerStore = writable(null);
export const selectedConversationStore = writable(null);