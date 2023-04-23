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
  import type { Message } from "$lib/types";
  import SvelteMarkdown from "svelte-markdown";
  import TableRenderer from "$lib/markdown-renderers/TableRenderer.svelte";
  import HTMLRenderer from "$lib/markdown-renderers/HTMLRenderer.svelte";
  import LinkRenderer from "$lib/markdown-renderers/LinkRenderer.svelte";
  import ImageRenderer from "$lib/markdown-renderers/ImageRenderer.svelte";
  import Fa from "svelte-fa";
  import {
    type IconDefinition,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons";
  import Tooltip from "sv-bootstrap-tooltip/src/Tooltip.svelte";
  import { API_HOST } from "$lib/constants";
  import { token, activeChannel, user } from "$lib/stores";
  import MessageAttachment from "./MessageAttachment.svelte";
  import { flags as BadgeFlags, glyphs as BadgeGlyphs, colors as BadgeColors } from "$lib/badges";

  export let data: Message;

  let dmAction: HTMLSpanElement;

  let badges: any[] = [];

  console.log(data.author.badges)

  BadgeFlags.forEach((value, badge) => {
    console.log((value & data.author.badges))
    if ((value & data.author.badges) == value) {
      badges.push({
        glyph: BadgeGlyphs.get(badge),
        color: BadgeColors.get(badge)
      });
    }
  });

  async function createDM() {
    const res = await fetch(API_HOST + "/dm/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: $token,
      },
      body: JSON.stringify({
        recipient: data.author._id,
      }),
    });
  }
</script>

<div class="message">
  <div class="message-header">
    <div class="message-author">
      <div class="message-author-name">
        {data.author.name}
      </div>
      <div class="message-author-badges">
        {#each badges as badge}
          <span style={"color:" + badge.color}><Fa icon={badge.glyph} /></span>
        {/each}
      </div>
    </div>
    <div class="message-actions">
      {#if !$activeChannel.is_dm && data.author._id != $user._id}
        <span
          class="message-action"
          bind:this={dmAction}
          on:click={createDM}
          on:keypress={createDM}
        >
          <Fa icon={faUserGroup} />
        </span>

        <Tooltip triggerElement={dmAction} placement="right">
          Privatnachricht
        </Tooltip>
      {/if}
    </div>
  </div>
  <div class="message-content">
    <SvelteMarkdown
      source={data.content}
      renderers={{
        table: TableRenderer,
        html: HTMLRenderer,
        link: LinkRenderer,
        image: ImageRenderer
      }}
    />
  </div>

  {#if data.attachment}
    <MessageAttachment attachment={data.attachment} />
  {/if}
</div>