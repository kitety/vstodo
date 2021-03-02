<script lang="ts">
  import HelloWorld from "./HelloWorld.svelte";

  let todos: { text: string; completed: boolean }[] = [];
  let count = 0;
  let text = "";
</script>

<div>Hello</div>
<form
  on:submit|preventDefault={() => {
    if (!text) return;
    todos = [
      {
        text,
        completed: false,
      },
      ...todos,
    ];

    text = "";
  }}
>
  <input type="text" bind:value={text} />
</form>

<ul>
  {#each todos as todo (todo.text)}
    <li
      class:completed={todo.completed}
      on:click={() => {
        todo.completed = !todo.completed;
      }}
    >
      {todo.text}
    </li>
  {/each}
</ul>
<!-- <pre>{JSON.stringify(todos,null,2)}</pre> -->

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
  li{
    cursor: pointer;
  }
  li.completed {
    text-decoration: line-through;
  }
</style>
