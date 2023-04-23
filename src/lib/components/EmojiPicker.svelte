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
    import {
        createPopup,
        type PopupPickerController,
    } from "@picmo/popup-picker";
    import { i18n, darkTheme } from "picmo";
    import { TwemojiRenderer } from "@picmo/renderer-twemoji";
    import { createEventDispatcher } from "svelte";
    import Fa from "svelte-fa";
    import { faFaceLaugh } from "@fortawesome/free-regular-svg-icons";
    import Tooltip from "sv-bootstrap-tooltip/src/Tooltip.svelte";

    const dispatch = createEventDispatcher();

    let picker: PopupPickerController;

    let button: HTMLButtonElement;

    const onLoad = (el: HTMLButtonElement) => {
        picker = createPopup(
            {
                renderer: new TwemojiRenderer(),
                i18n: i18n.de,
                theme: darkTheme,
            },
            {
                referenceElement: el,
                hideOnClickOutside: false,
                position: "left",
            }
        );

        picker.addEventListener("emoji:select", (emoji) => {
            dispatch("select", emoji);
        });
    };
</script>

<button
    use:onLoad
    class="btn btn-primary"
    bind:this={button}
    on:click={() => picker.toggle()}><Fa icon={faFaceLaugh} /></button
>

<Tooltip triggerElement={button} placement="left">Emoji</Tooltip>
