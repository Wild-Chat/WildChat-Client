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
  import { goto } from "$app/navigation";
  import { token, activeChannel } from "$lib/stores";
  import { cache } from "$lib/stores";
  import { API_HOST } from "$lib/constants";
  import { io } from "socket.io-client";
  import ChannelList from "$lib/components/ChannelList.svelte";
  import ChatWindow from "$lib/components/ChatWindow.svelte";
  import ChatInput from "$lib/components/ChatInput.svelte";
  import ChannelBanner from "$lib/components/ChannelBanner.svelte";

  if (!$token) {
    goto("/login");
  }

  const ws = io(API_HOST);

  let channelList: ChannelList;

  let chatWindow: ChatWindow;

  activeChannel.subscribe((value) => {
    cache.update((current) => {
      let channel = current.channels.get(value._id);
      if (channel) {
        channel.unread = 0;
        current.channels.set(channel._id, channel);
      }
      return current;
    });
  });

  ws.on("message", (msg) => {
    cache.update((current) => {
      let channel = current.channels.get(msg.channel._id);

      if (channel == undefined) {
        channel = {
          _id: msg.channel._id,
          name: msg.channel.name,
          unread: 0,
          messages: [],
          lastMessage: Date.now(),
          is_dm: msg.channel.is_dm,
          autofocus: msg.channel.autofocus,
        };
      }

      channel.messages.push(msg);

      channel.lastMessage = Date.now();

      if ($activeChannel._id != msg.channel._id) {
        channel.unread += 1;
      }

      current.channels.set(msg.channel._id, channel);

      return current;
    });

    if ($activeChannel._id == msg.channel._id) {
      chatWindow.scrollToBottom()
    }
  });

  ws.on("error", (err) => {
    console.error("WS Error", err);
  });

  ws.on("channel-join", (channel) => {
    const cacheChannel = {
      _id: channel._id,
      name: channel.name,
      unread: 0,
      messages: [],
      lastMessage: Date.now(),
      is_dm: channel.is_dm,
      autofocus: channel.autofocus,
      participants: channel.participants,
    };
    cache.update((current) => {
      current.channels.set(channel._id, cacheChannel);
      if (cacheChannel.autofocus) activeChannel.set(cacheChannel);
      return current;
    });
  });

  ws.emit("login", $token);
</script>

<ChannelList bind:this={channelList} />

<div id="chat-wrapper">
  <ChannelBanner {channelList} />

  <ChatWindow bind:this={chatWindow} />

  <ChatInput
    on:message={(e) => {
      ws.emit("message", e.detail);
      chatWindow.scrollToBottom(true);
    }}
  />
</div>

<svelte:head>
  <title>WildChat | {$activeChannel.name}</title>
</svelte:head>
