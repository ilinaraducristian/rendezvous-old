<script>
  import InputBox from './InputBox.svelte';
import {selectedConversationStore} from './stores';
  let selectedConversation = null;
  selectedConversationStore.subscribe(selectedConversationValue => selectedConversation = selectedConversationValue);
  let messages = new Array(100).fill(0).map((_, i) => ({id: i, text: `Message ${i}`})).reverse();
</script>

<div class="thirdPanel">
  {#if selectedConversation !== null}
    <header>
      <span>{selectedConversation.name}</span>
    </header>
    <ul>
      {#each messages as message}
        <li>
          <span>{message.text}</span>
        </li>
      {/each}
    </ul>
    <InputBox/>
    {/if}
</div>

<style>
  .thirdPanel {
    background-color: var(--seventh-color);
    flex-grow: 1;
    color: var(--third-color);
    width: 100px;
  }
  .thirdPanel {
    display: flex;
    flex-direction: column;
  }
  ul {
    display: flex;
    flex-direction: column-reverse;
    flex-grow: 1;
  }
</style>