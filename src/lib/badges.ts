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

import {
    type IconDefinition,
    faStar,
    faCrown,
    faVenus,
    faMars,
    faTransgender
} from "@fortawesome/free-solid-svg-icons";

export const flags = new Map<string, number>([
    ["admin", 0b10000000],
    ["premium", 0b00001000],
    ["diverse", 0b00000100],
    ["female", 0b00000010],
    ["male", 0b00000001],
])

export const glyphs = new Map<string, IconDefinition>([
    ["admin", faCrown],
    ["premium", faStar],
    ["diverse", faTransgender],
    ["female", faVenus],
    ["male", faMars]
])

export const colors = new Map<string, string>([
    ["admin", "gold"],
    ["premium", "gold"],
    ["diverse", "purple"],
    ["female", "pink"],
    ["male", "blue"]
])