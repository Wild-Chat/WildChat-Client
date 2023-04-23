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
    import { activeChannel } from "$lib/stores";
    import Fa from "svelte-fa";
    import { faBars, faComment, faUser } from "@fortawesome/free-solid-svg-icons";
    import type ChannelList from "./ChannelList.svelte";

    export let channelList: ChannelList;

</script>

<div id="channel-banner">
    <button class="btn btn-primary" id="channel-list-toggle" on:click={() => channelList.toggle()}><Fa icon={faBars} /></button>

    {#if $activeChannel.is_dm}
        <Fa icon={faUser} />
    {:else}
        <Fa icon={faComment} />
    {/if}

    {$activeChannel.name}
</div>

<hr />
