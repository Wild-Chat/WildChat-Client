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
  export let href: string;
  export let text: string;

  try {
    let url = new URL(href)

    switch (url.protocol) {
      case "javascript:":
        href = "#"
        break;

      // Insert more protocols here
    
      default:
        break;
    }

  } catch (error) {
    // Provided URL is invalid
    href = "#"
  }

</script>

<a href={"/out/" + encodeURIComponent(href)} target="_blank">{text}</a>