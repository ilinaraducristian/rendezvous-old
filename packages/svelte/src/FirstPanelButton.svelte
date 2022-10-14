<script>
  export let server = {};
  import { selectedServerStore } from './stores.js';
  $: name = server.name ?? '';
  let isSelected = false;
  selectedServerStore.subscribe(selectedServer => {
    isSelected = server.id === (selectedServer?.id ?? null);
  })
  function selectServer() {
    selectedServerStore.set(server);
  }
</script>

<li>
  <button type="button" on:click={selectServer} class:active="{isSelected}">
    {name.slice(0, 2)}
  </button>
</li>

<style>
  button {
    width: 48px;
    height: 48px;
    background-color: var(--secondary-color);
    border-radius: 50%;
    display: grid;
    place-content: center;
    transition: background-color 300ms, border-radius 300ms;
    border: none;
    color: var(--third-color);
    cursor: pointer;
  }
  button:hover, .active {
    background-color: var(--forth-color);
    border-radius: 15%;
  }
</style>
