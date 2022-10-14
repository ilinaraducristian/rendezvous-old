<script>
  let servers = new Array(100)
    .fill(0)
    .map((_, i) => ({ id: i, name: `Server ${i}`, groups: [{ id: 69, name: "Text channels", channels: [{ id: 70, name: "general" }] }] }));
  import FirstPanelButton from "./FirstPanelButton.svelte";
</script>

<ul class="firstPanel">
  <FirstPanelButton server={{ id: null, name: "H" }} />
  {#each servers as server}
    <FirstPanelButton {server} />
  {/each}
</ul>

<style>
  ul {
    width: 72px;
    align-items: center;
    gap: 8px;
    background-color: var(--primary-color);
  }
</style>
