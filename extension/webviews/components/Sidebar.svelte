<script lang="ts">
  import { onMount } from "svelte";
  import type { IMessageType } from "../globals";
  import type { User } from "../types";
  import Todos from "./Todos.svelte";

  let loading = true;
  let user: User | null = null;
  const loginWithGithub = () => {
    window.vscode.postMessage({
      type: "authoricate",
      value: undefined,
    });
  };
  const logout = () => {
    user = null;
    window.vscode.postMessage({
      type: "logout",
      value: undefined,
    });
  };
  onMount(async () => {
    window.addEventListener(
      "message",
      async (event: MessageEvent<IMessageType>) => {
        const { type, value } = event.data;
        switch (type) {
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

{#if loading}
  <div>loading...</div>
{:else if user}
  <pre>{JSON.stringify(user,null,2)}</pre>
  <Todos {user} />

  <button on:click={logout}>Logout</button>
{:else}
  <button on:click={loginWithGithub}>Login with github</button>
{/if}
