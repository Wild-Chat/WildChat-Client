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
  import Fa from "svelte-fa";
  import {
    faArrowRight,
    faArrowLeft
  } from "@fortawesome/free-solid-svg-icons";
  import { token, user } from "$lib/stores";
  import { API_HOST } from "$lib/constants";
  import { goto } from "$app/navigation";

  let name = "";
  let gender: number;
  let accessCode: string | undefined;

  let needAccessCode = false;

  async function login() {
    const res = await fetch(API_HOST + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        accessCode,
        gender,
      }),
    });

    const data = await res.json();

    if (data.error) {
      switch (data.error) {
        case "NAME_RESERVED":
          needAccessCode = true
          break;

        case "INVALID_ACCESS_CODE":
          alert('Falscher Zugangscode')
          break;

        default:
          alert(data.error);
          break;
      }
    } else {
      token.set(data.user.token);
      user.set(data.user);
      goto("/");
    }
  }
</script>

<div class="container" id="content">
  <h1>WildChat</h1>

  {#if !needAccessCode}
    <form on:submit={() => login()}>
      <div class="mb-3 mt-3">
        <input
          type="text"
          class="form-control"
          id="name"
          placeholder="Dein Name"
          name="name"
          required
          bind:value={name}
        />
      </div>

      <select class="form-select" bind:value={gender}>
        <option value={0b00000000}>Kein Geschlecht</option>
        <option value={0b00000001}>Männlich</option>
        <option value={0b00000010}>Weiblich</option>
        <option value={0b00000100}>Divers</option>
      </select>

      <div class="mb-3 mt-3">
        <button type="submit" class="btn btn-primary"
          ><Fa icon={faArrowRight} /></button
        >
      </div>
    </form>

  {:else}

  <form on:submit={() => login()}>

    <h3>Name Reserviert</h3>

    Um <strong>{name}</strong> benutzen zu können, gib deinen Zugangscode ein

    <div class="mb-3 mt-3">
      <input
        type="password"
        class="form-control"
        placeholder="Zugangscode"
        required
        bind:value={accessCode}
        on:keydown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            login();
          } 
        }}
      />
    </div>

    <div class="mb-3 mt-3">
      <button class="btn btn-primary" on:click={() => {accessCode = undefined;needAccessCode = false}}
        ><Fa icon={faArrowLeft} /></button
      >
      <button type="submit" class="btn btn-primary"
        ><Fa icon={faArrowRight} /></button
      >
    </div>
  </form>

  {/if}
</div>

<svelte:head>
  <title>WildChat | Login</title>
</svelte:head>

<style>
  #content {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
</style>
