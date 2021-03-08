<script lang="ts">
  import { onMount } from "svelte";
  import type { IMessageType } from "../globals";

  let todos: { text: string; completed: boolean }[] = [];
  const addTodo = (value: string) => {
    todos = [
      {
        text: value,
        completed: false,
      },
      ...todos,
    ];
  };
  let count = 0;
  let text = "";
  let loading = true;
  let user: { name: string } | null = null;
  onMount(async () => {
    window.addEventListener(
      "message",
      async (event: MessageEvent<IMessageType>) => {
        const { type, value } = event.data;
        switch (type) {
          case "new-todo":
            addTodo(value);
            break;
          case "token":
            const res = await fetch(`${window.apiBaseUrl}/me`, {
              headers: {
                authorization: `Bearer ${value}`,
              },
            });
            const data = await res.json();
            user = data.user;
            console.log("user: ", user);
            loading = false;
            break;

          default:
            break;
        }
      }
    );
    window.vscode.postMessage({
      type: "get-token",
      value: undefined,
    });
  });
</script>

<div>Hello</div>
{#if loading}
  <div>loading...</div>
{:else if user}
  <pre>{JSON.stringify(user,null,2)}</pre>
{:else}
  <div>no user is logined</div>
{/if}
<form
  on:submit|preventDefault={() => {
    if (!text) return;
    addTodo(text);

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

<button
  on:click={() => {
    window.vscode.postMessage({
      type: "onInfo",
      value: "info messages",
    });
  }}>Info Click Me</button
>
<button
  on:click={() => {
    window.vscode.postMessage({
      type: "onError",
      value: "error messages",
    });
  }}>Error Click Me</button
>
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
  li {
    cursor: pointer;
  }
  li.completed {
    text-decoration: line-through;
  }
</style>
