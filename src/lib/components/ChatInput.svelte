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
  import { activeChannel, token } from "$lib/stores";
  import type { Attachment } from "$lib/types";
  import { createEventDispatcher } from "svelte";
  import Fa from "svelte-fa";
  import { faArrowRight, faPaperclip } from "@fortawesome/free-solid-svg-icons";
  import EmojiPicker from "./EmojiPicker.svelte";
  import { API_HOST } from "$lib/constants";
  import Tooltip from "sv-bootstrap-tooltip/src/Tooltip.svelte";

  const dispatch = createEventDispatcher();

  export let modkey = "Shift";

  let filePicker: HTMLInputElement;
  let pickerFiles: FileList;

  let uploading = false;

  let inputElement: HTMLTextAreaElement;

  let filePickerButton: HTMLButtonElement;
  let sendButton: HTMLButtonElement;

  let currentMessage = "";
  let attachment: Attachment | undefined;
  let mod = false; // Switches between newline and send on enter

  async function send() {
    if (
      (currentMessage.trim() == "" && !attachment) ||
      currentMessage.length > 10000
    ) {
      return;
    }

    const channel = $activeChannel;

    if (attachment) {
      uploading = true;
      attachment.id = await uploadAttachment();
      attachment.data = undefined;
      uploading = false;
    }

    const message = {
      content: currentMessage,
      attachment: attachment,
      channel,
    };

    dispatch("message", message);
    currentMessage = "";
    attachment = undefined;
    inputElement.focus();
  }

  function uploadAttachment() {
    return new Promise<string>(async (resolve, reject) => {
      const res = await fetch(API_HOST + "/attachment/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: $token,
        },
        body: JSON.stringify(attachment),
      });
      const data = await res.json();
      if (data.error) return reject(data.error);
      resolve(data.id);
    });
  }

  function addEmoji(e: any) {
    currentMessage += e.detail.emoji;
    inputElement.focus();
  }

  function handleFilePaste(e: ClipboardEvent) {
    if (e.clipboardData == null) return;
    const file = e.clipboardData.files[0];
    if (!file) return;
    fileToAttachment(file);
  }

  function pickFile() {
    inputElement.focus();
    if (filePicker.files != undefined && filePicker.files.length > 0) {
      fileToAttachment(filePicker.files[0]);
    }
  }

  function fileToAttachment(file: File) {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (
        !event.target ||
        !event.target.result ||
        typeof event.target.result != "string"
      )
        return;
      const fileData = event.target.result.split(",")[1];

      attachment = {
        name: file.name,
        data: fileData,
        type: file.type || "text/plain",
      };
    };
    reader.readAsDataURL(file);
  }
</script>

{#if attachment != undefined}
  <div class="attachment-indicator">
    <button
      class="btn btn-primary"
      on:click={() => {
        attachment = undefined;
      }}
    >
      {attachment.name}

      {#if uploading}
        <div class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      {/if}
    </button>
  </div>
{/if}

<!-- svelte-ignore a11y-autofocus -->
<div id="chat-input">
  <textarea
    class="form-control"
    placeholder="Nachricht"
    bind:value={currentMessage}
    bind:this={inputElement}
    rows="3"
    maxlength="10000"
    autofocus
    on:keydown={(e) => {
      if (e.key == "Enter" && !mod) {
        e.preventDefault();
        send();
      } else if (e.key == modkey) {
        mod = true;
      }
    }}
    on:keyup={(e) => {
      if (e.key == modkey) {
        mod = false;
      }
    }}
    on:paste={handleFilePaste}
  />

  <div id="input-actions">
    <EmojiPicker on:select={addEmoji} />
    <button
      class="btn btn-primary"
      id="attach-button"
      bind:this={filePickerButton}
      on:click={() => filePicker.click()}><Fa icon={faPaperclip} /></button
    >
    <button
      class="btn btn-primary"
      id="send-button"
      bind:this={sendButton}
      on:click={send}><Fa icon={faArrowRight} /></button
    >
  </div>
</div>

<input
  id="file-picker-input"
  type="file"
  bind:files={pickerFiles}
  bind:this={filePicker}
  on:change={pickFile}
/>

<Tooltip triggerElement={filePickerButton} placement="left">
  Datei Anhängen
</Tooltip>

<Tooltip triggerElement={sendButton} placement="left">Senden</Tooltip>

<style>
  #send-button {
    margin-top: 1rem;
  }

  #attach-button {
    margin-top: 1rem;
  }

  #input-actions {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
  }

  #file-picker-input {
    display: none;
  }

  .attachment-indicator {
    margin-bottom: 0.5rem;
  }
</style>
