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

  cache.subscribe((value) => {
    //console.log('update')
    messages = Array.from(
      value.channels.get($activeChannel._id)?.messages || messages
    );
  });

  activeChannel.subscribe((value) => {
    messages = Array.from(value.messages);
  });
</script>

<div id="chat-window">
  {#each messages as message}
    <MessageComponent data={message} />
  {/each}
</div>
