<script>
  import { selectedConversationStore } from "./stores.js";
  export let conversation = {};
  $: id = conversation.id ?? '';
  $: imgSrc = conversation.imgSrc ?? null;
  $: name = conversation.name ?? '';
  $: lastMessage = conversation.lastMessage ?? '';
  let isSelected = false;
  let selectedConversation = null;
  $: img = imgSrc === null ? "" : `background: url(${imgSrc})`;
  $: isSelected = id === selectedConversation?.id;

  selectedConversationStore.subscribe((selectedConversationValue) => (selectedConversation = selectedConversationValue));

  function onClick() {
    selectedConversationStore.set(conversation);
  }
</script>

<li>
  <button type="button" on:click={onClick} class:active={isSelected}>
    <div class="image" style={img}>
      {name.slice(0, 2)}
    </div>
    <div class="container">
      <span>{name}</span>
      {#if lastMessage !== null}
        <span>{lastMessage}</span>
      {/if}
    </div>
  </button>
  <slot />
</li>

<style>
  .image {
    min-width: 32px;
    min-height: 32px;
    background-color: var(--forth-color);
    border-radius: 50%;
    display: grid;
    place-content: center;
  }
  li {
    padding: 5px;
  }
  button {
    border: none;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    text-align: start;
    color: var(--third-color);
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 5px;
    height: 48px;
    width: 100%;
    border-radius: 5px;
  }
  button:hover,
  .active {
    background-color: rgba(255, 255, 255, 0.1);
  }
  span {
    display: block;
    text-overflow: ellipsis;
    overflow-x: hidden;
    white-space: nowrap;
  }
  .container {
    overflow-x: hidden;
  }
</style>
