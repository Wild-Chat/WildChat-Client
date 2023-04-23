<!--
    WildChat-Client
    Copyright (C) 2023  Marcus Huber (xenorio) <dev@xenorio.xyz>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

<script lang="ts">
  import { activeChannel, cache } from "$lib/stores";
  import type { Message } from "$lib/types";

  import MessageComponent from "./Message.svelte";

  let messages: Message[] = [];
  let scrollLock = false;

  let windowElement: HTMLDivElement;

  export const scrollToBottom = (force?: boolean) => {
    if(!scrollLock || force){
      setTimeout(() => {
        windowElement.scrollTop = windowElement.scrollHeight - windowElement.clientHeight;
      }, 1)
    }
  };

  cache.subscribe((value) => {
    messages = Array.from(
      value.channels.get($activeChannel._id)?.messages || messages
    );
  });

  activeChannel.subscribe((value) => {
    messages = Array.from(value.messages);
  });

  function handleScroll(e: Event) {
    if (!e.target) return;
    const target = <HTMLDivElement>e.target;
    const isAtBottom =
      target.scrollTop === target.scrollHeight - target.clientHeight;

    if(isAtBottom){
      scrollLock = false
    }else{
      scrollLock = true
    }
  }
</script>

<div id="chat-window" on:scroll={handleScroll} bind:this={windowElement}>
  {#each messages as message}
    <MessageComponent data={message} />
  {/each}
</div>
