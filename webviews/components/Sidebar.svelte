<script lang="ts">
  let todos: { text: string; completed: boolean }[] = [];
  let count = 0;
  let text = "";
</script>

<div>Hello</div>
<form>
  <input type="text" bind:value={text} />
  <pre>{JSON.stringify(todos,null,2)}</pre>
</form>

<!-- <input type="text" bind:value={text} />
<button
  on:click={() => {
    count++;
    console.log("count: ", count);
  }}>increment {count}</button
>
<b>{text}</b>
<button
  on:click={() => {
    text = "";
  }}
  >reset text
</button> -->
<style>
  div {
    color: red;
  }
</style>
