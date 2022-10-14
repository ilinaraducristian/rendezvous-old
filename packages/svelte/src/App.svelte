<script>
  import FirstPanel from "./FirstPanel.svelte";
  import SecondPanel from "./SecondPanel.svelte";
  import { selectedServerStore, selectedConversationStore } from "./stores.js";
  import ThirdPanel from "./ThirdPanel.svelte";
  let selectedConversation = null;
  let selectedServer = null;
  selectedServerStore.subscribe((selectedServerValue) => (selectedServer = selectedServerValue));
  selectedConversationStore.subscribe((selectedConversationValue) => {
    selectedConversation = selectedConversationValue;
  });
</script>

<FirstPanel />
<SecondPanel />
<ThirdPanel />
