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
    import { token } from "$lib/stores";
    import { API_HOST } from "$lib/constants";
    import type { Attachment } from "$lib/types";
    import Fa from "svelte-fa";
    import {
        faPaperclip,
        faDownload,
        faUpRightFromSquare,
    } from "@fortawesome/free-solid-svg-icons";
    import Tooltip from "sv-bootstrap-tooltip/src/Tooltip.svelte";

    export let attachment: Attachment;

    let openButton: HTMLButtonElement;
    let downloadButton: HTMLButtonElement;

    let url: string;
    let elType: string;
    let loaded = false;
    let fetching = false;

    async function fetchAttachment() {
        fetching = true;
        const res = await fetch(API_HOST + `/attachment/${attachment.id}`, {
            headers: {
                Authorization: $token,
            },
        });
        const data = await res.json();
        url = "data:" + data.type + ";base64," + data.data;
        elType = data.type.split("/")[0].toLowerCase();
        loaded = true;
    }
</script>

<div class="message-attachment">
    <div class="attachment-meta">
        <span class="attachment-name">
            {#if attachment.name.length <= 32}
                {attachment.name}
            {:else}
                ...{attachment.name.substring(
                    attachment.name.length - 32,
                    attachment.name.length + 1
                )}
            {/if}
        </span>

        <a
            href={API_HOST + "/attachment/" + attachment.id + "/raw"}
            target="_blank"
            class="attachment-open"
        >
            <button class="btn btn-secondary" bind:this={openButton}
                ><Fa icon={faUpRightFromSquare} /></button
            >
        </a>

        <a
            href={API_HOST + "/attachment/" + attachment.id + "/raw/download"}
            target="_blank"
            class="attachment-download"
        >
            <button class="btn btn-secondary" bind:this={downloadButton}
                ><Fa icon={faDownload} /></button
            >
        </a>

        <Tooltip triggerElement={openButton} placement="right">Öffnen</Tooltip>

        <Tooltip triggerElement={downloadButton} placement="right">
            Herunterladen
        </Tooltip>
    </div>
    <div class="attachment-content">
        {#if loaded}
            {#if elType == "image"}
                <img src={url} alt={attachment.name} />
            {:else if elType == "video"}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video src={url} controls />
            {:else if elType == "audio"}
                <audio src={url} controls />
            {:else}
                Vorschau nicht verfügbar
            {/if}
        {:else}
            <button class="btn btn-secondary" on:click={() => fetchAttachment()}
                ><Fa icon={faPaperclip} /> Anhang Laden

                {#if fetching}
                    <div
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    />
                {/if}
            </button>
        {/if}
    </div>
</div>
