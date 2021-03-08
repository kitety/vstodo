<script lang="ts">
  import { onMount } from "svelte";
  import type { IMessageType } from "../globals";
  import type { User } from "../types";

  export let user: User = {} as User;

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
  let text = "";
  onMount(async () => {
    window.addEventListener(
      "message",
      async (event: MessageEvent<IMessageType>) => {
        const { type, value } = event.data;
        switch (type) {
          case "new-todo":
            addTodo(value);
            break;

          default:
            break;
        }
      }
    );
  });
</script>

<div>Hello {user.name}</div>

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
