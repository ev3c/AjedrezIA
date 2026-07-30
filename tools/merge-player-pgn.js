#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const playersRoot = path.join(root, 'games', 'jugadors');
const indexPath = path.join(playersRoot, 'index.json');
const sourceId = process.argv[2];
const targetId = process.argv[3];

if (!sourceId || !targetId || sourceId === targetId) {
    throw new Error('Uso: node tools/merge-player-pgn.js <origen> <destino>');
}

const sourceDir = path.join(playersRoot, sourceId);
const targetDir = path.join(playersRoot, targetId);
const sourceFile = path.join(sourceDir, 'games.pgn');
const targetFile = path.join(targetDir, 'games.pgn');

if (!fs.existsSync(sourceFile)) throw new Error(`No existe el origen: ${sourceFile}`);
if (!fs.existsSync(targetFile)) throw new Error(`No existe el destino: ${targetFile}`);

function splitGames(raw) {
    return raw
        .replace(/^\uFEFF/, '')
        .split(/(?=\[Event\s+")/)
        .map(game => game.trim())
        .filter(game => game.startsWith('[Event'));
}

function header(game, name) {
    const line = game
        .split(/\r?\n/)
        .find(value => value.startsWith(`[${name} `));
    return line ? (line.split('"')[1] || '?') : '?';
}

function gameKey(game) {
    return ['White', 'Black', 'Date', 'Round']
        .map(name => header(game, name).trim().toLocaleLowerCase('es'))
        .join('|');
}

const targetGames = splitGames(fs.readFileSync(targetFile, 'utf8'));
const sourceGames = splitGames(fs.readFileSync(sourceFile, 'utf8'));
const knownKeys = new Set(targetGames.map(gameKey));
const additions = [];
let duplicates = 0;

for (const game of sourceGames) {
    const key = gameKey(game);
    if (knownKeys.has(key)) {
        duplicates++;
        continue;
    }
    knownKeys.add(key);
    additions.push(game);
}

const merged = targetGames.concat(additions);
fs.writeFileSync(targetFile, merged.join('\n\n') + '\n', 'utf8');
fs.rmSync(sourceDir, { recursive: true, force: true });

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8').replace(/^\uFEFF/, ''));
const targetEntry = index.find(entry => entry.id === targetId);
if (!targetEntry) throw new Error(`No existe ${targetId} en index.json`);

targetEntry.gameCount = merged.length;
targetEntry.sizeMB = Math.round(
    (fs.statSync(targetFile).size / 1024 / 1024) * 100
) / 100;

const updatedIndex = index
    .filter(entry => entry.id !== sourceId)
    .sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2) + '\n', 'utf8');

console.log(
    `${sourceId} → ${targetId}: ${additions.length} añadidas, ` +
    `${duplicates} duplicadas omitidas, ${merged.length} total.`
);
