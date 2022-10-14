<script>
  import SecondPanelButton from "./SecondPanelButton.svelte";
  import { selectedServerStore, selectedConversationStore } from "./stores";
  let selectedServer = null;
  let selectedConversation = null;

  selectedServerStore.subscribe((selectedServerValue) => (selectedServer = selectedServerValue));
  selectedConversationStore.subscribe((selectedConversationValue) => (selectedConversation = selectedConversationValue));

  let conversations = new Array(100).fill(0).map((_, i) => ({ id: i, name: `John Doe ${i + 1}`, lastMessage: "Message 1" }));
</script>

<ul class="secondPanel">
  {#each conversations as conversation}
    <SecondPanelButton {conversation} />
  {/each}
</ul>

<style>
  ul {
    background-color: var(--sixth-color);
    padding-top: 10px;
    width: 240px;
  }
</style>
