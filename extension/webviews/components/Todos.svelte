<script lang="ts">
  import { onMount } from "svelte";
  import type { IMessageType } from "../globals";
  import type { User } from "../types";

  export let user: User = {} as User;
  export let accessToken: string;
  interface ITodo {
    text: string;
    completed: boolean;
  }

  let todos: ITodo[] = [];
  const addTodo = (todo: ITodo) => {
    todos = [todo, ...todos];
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
  on:submit|preventDefault={async () => {
    if (!text) return;
    const res = await fetch(`${window.apiBaseUrl}/todo`, {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: {
        'content-type':'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    });
    const { todo } = await res.json();
    addTodo(todo);

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
