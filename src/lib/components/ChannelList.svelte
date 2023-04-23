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
  import { cache, activeChannel, user } from "$lib/stores";
  import Fa from "svelte-fa";
  import {
    faUser,
    faComment,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";

  let toggled = true;

  export const toggle = () => {
    toggled = !toggled;
  };

  function findRecipient(channel: any) {
    return channel.participants.find((x: any) => x._id != $user._id);
  }
</script>

{#if toggled}
  <ul class="list-group" id="channel-list">
    <button
      class="btn btn-primary"
      id="channel-list-close"
      on:click={() => {
        toggled = false;
      }}><Fa icon={faXmark} /></button
    >

    {#each Array.from($cache.channels) as [id, channel]}
      <li
        class={"list-group-item d-flex justify-content-between align-items-center " +
          ($activeChannel._id == id ? "active" : "")}
        on:click={() => activeChannel.set(channel)}
        on:keypress={() => activeChannel.set(channel)}
      >
        <span class="channel-name">
          {#if channel.is_dm}
            <Fa icon={faUser} />
            {findRecipient(channel).name}
          {:else}
            <Fa icon={faComment} />
            {channel.name}
          {/if}
        </span>

        {#if channel.unread > 0}
          <span class="badge bg-primary rounded-pill">
            {channel.unread}
          </span>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  #channel-list-close {
    display: none; /* we only want this on mobile */
    margin: 0.5rem;
  }

  @media screen and (max-width: 800px) {
    #channel-list-close {
      display: block;
    }
    #channel-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100vw;
    }
  }
</style>
