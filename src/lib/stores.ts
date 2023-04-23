/*
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
*/

import { writable } from 'svelte/store';
import type {Channel} from './types'

export const token = writable("");

export const activeChannel = writable(<Channel> {
    _id: 'global',
    name: "global",
    unread: 0,
    messages: [],
    lastMessage: Date.now(),
    is_dm: false,
    autofocus: false
});

export const cache = writable({
    channels: new Map<string, Channel>()
})

export const user = writable(<any>{})