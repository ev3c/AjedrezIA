#!/usr/bin/env node
'use strict';

/**
 * Valida games/jugadors con el mismo motor y el mismo parser SAN de AjedrezIA.
 *
 * Uso:
 *   node tools/clean-invalid-player-pgn.js
 *   node tools/clean-invalid-player-pgn.js --apply
 *   node tools/clean-invalid-player-pgn.js --file carlsen
 *
 * Sin --apply no modifica la biblioteca. Siempre genera un informe JSON.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const playersRoot = path.join(root, 'games', 'jugadors');
const indexPath = path.join(playersRoot, 'index.json');
const reportPath = path.join(root, 'tools', 'invalid-player-games-report.json');
const apply = process.argv.includes('--apply');
const fileArgIndex = process.argv.indexOf('--file');
const requestedPlayer = fileArgIndex >= 0 ? process.argv[fileArgIndex + 1] : '';
const shardArgIndex = process.argv.indexOf('--shard');
const shardSpec = shardArgIndex >= 0 ? process.argv[shardArgIndex + 1] : '';
const shardMatch = shardSpec.match(/^(\d+)\/(\d+)$/);
const shardIndex = shardMatch ? parseInt(shardMatch[1], 10) : -1;
const shardCount = shardMatch ? parseInt(shardMatch[2], 10) : 0;
const mergeArgIndex = process.argv.indexOf('--merge-shards');
const mergeShardCount = mergeArgIndex >= 0
    ? parseInt(process.argv[mergeArgIndex + 1], 10)
    : 0;
const reindexOnly = process.argv.includes('--reindex-only');
const applyReport = process.argv.includes('--apply-report');
const markReportApplied = process.argv.includes('--mark-report-applied');

if (
    shardSpec &&
    (!shardMatch || shardIndex < 0 || shardIndex >= shardCount || shardCount < 1)
) {
    throw new Error('Formato de --shard inválido. Usa índice/total, por ejemplo 0/8.');
}

function loadChessGame() {
    const source = fs.readFileSync(path.join(root, 'chess-logic.js'), 'utf8');
    const context = vm.createContext({ console });
    vm.runInContext(source, context, { filename: 'chess-logic.js' });
    return vm.runInContext('ChessGame', context);
}

const ChessGame = loadChessGame();

function splitGames(raw) {
    return raw
        .replace(/^\uFEFF/, '')
        .split(/(?=\[Event\s+")/)
        .map(game => game.trim())
        .filter(game => game.startsWith('[Event'));
}

function extractHeader(pgn, name) {
    const match = pgn.match(new RegExp(`\\[${name}\\s+"([^"]*)"\\]`));
    return match ? match[1] : '';
}

function tokenizeLikeAjedrezIA(pgn) {
    let movesText = pgn
        .replace(/\[.*?\]\s*/g, '')
        .replace(/\{[^}]*\}/g, '')
        .replace(/;.*$/gm, '')
        .replace(/\$\d+/g, '');

    let previous;
    do {
        previous = movesText;
        movesText = movesText.replace(/\([^()]*\)/g, '');
    } while (movesText !== previous);

    movesText = movesText.replace(/\d+\.\.\./g, '').trim();
    movesText = movesText.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '').trim();

    return movesText
        .split(/\s+/)
        .filter(token =>
            token &&
            !token.match(/^\d+\.?$/) &&
            !token.match(/^\$/) &&
            !token.match(/^(1-0|0-1|1\/2-1\/2|\*)$/)
        )
        .map(token => token.replace(/^\d+\./, ''))
        .filter(token => token.length > 0 && token.match(/^[a-hKQRBNO0]/));
}

function parseSANMove(san, gameState, allCandidates) {
    const color = gameState.currentTurn;
    san = san.replace(/[+#!?]/g, '');

    if (san === 'O-O' || san === '0-0') {
        const row = color === 'white' ? 7 : 0;
        const candidate = { fromRow: row, fromCol: 4, toRow: row, toCol: 6 };
        if (allCandidates) allCandidates.push(candidate);
        return candidate;
    }
    if (san === 'O-O-O' || san === '0-0-0') {
        const row = color === 'white' ? 7 : 0;
        const candidate = { fromRow: row, fromCol: 4, toRow: row, toCol: 2 };
        if (allCandidates) allCandidates.push(candidate);
        return candidate;
    }

    const files = 'abcdefgh';
    const pieceMap = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight' };
    let pieceType = 'pawn';
    let disambigFile = -1;
    let disambigRank = -1;
    let promotion = null;
    let value = san;

    const promoMatch = value.match(/=?([QRBN])$/);
    if (promoMatch) {
        promotion = promoMatch[1];
        value = value.replace(/=?[QRBN]$/, '');
    }

    if (value[0] && pieceMap[value[0]]) {
        pieceType = pieceMap[value[0]];
        value = value.substring(1);
    }

    value = value.replace('x', '');
    if (value.length < 2) return null;

    const toFile = files.indexOf(value[value.length - 2]);
    const toRank = 8 - parseInt(value[value.length - 1], 10);
    if (toFile < 0 || toRank < 0 || toRank > 7) return null;

    const disambig = value.substring(0, value.length - 2);
    for (const character of disambig) {
        if (files.includes(character)) disambigFile = files.indexOf(character);
        else if (character >= '1' && character <= '8') {
            disambigRank = 8 - parseInt(character, 10);
        }
    }

    const promoMap = { Q: 'queen', R: 'rook', B: 'bishop', N: 'knight' };
    const candidates = [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = gameState.getPiece(row, col);
            if (!piece || piece.color !== color || piece.type !== pieceType) continue;
            if (disambigFile >= 0 && col !== disambigFile) continue;
            if (disambigRank >= 0 && row !== disambigRank) continue;

            const validMoves = gameState.getValidMoves(row, col);
            if (validMoves.some(move => move.row === toRank && move.col === toFile)) {
                candidates.push({
                    fromRow: row,
                    fromCol: col,
                    toRow: toRank,
                    toCol: toFile,
                    promotion: promotion ? promoMap[promotion] : undefined
                });
            }
        }
    }

    if (allCandidates) allCandidates.push(...candidates);
    return candidates[0] || null;
}

function validateGame(pgn) {
    const moves = tokenizeLikeAjedrezIA(pgn);
    if (moves.length === 0) {
        return { valid: false, reason: 'sin movimientos reconocibles', tokenIndex: 0, token: '' };
    }

    const game = new ChessGame();
    let movesPlayed = 0;
    const ambiguousHistory = [];

    for (let tokenIndex = 0; tokenIndex < moves.length; tokenIndex++) {
        const sanMove = moves[tokenIndex];
        if (game.gameOver) game.gameOver = false;

        const candidates = [];
        const parsed = parseSANMove(sanMove, game, candidates);

        if (!parsed) {
            let recovered = false;

            for (let historyIndex = ambiguousHistory.length - 1;
                historyIndex >= 0 && !recovered;
                historyIndex--) {
                const entry = ambiguousHistory[historyIndex];
                if (entry.triedIndex >= entry.candidates.length - 1) continue;

                const undoCount = movesPlayed - entry.moveIndex;
                for (let undoIndex = 0; undoIndex < undoCount; undoIndex++) {
                    game.undoMove();
                    movesPlayed--;
                }

                entry.triedIndex++;
                const alternative = entry.candidates[entry.triedIndex];
                if (game.gameOver) game.gameOver = false;
                const alternativeResult = game.makeMove(
                    alternative.fromRow,
                    alternative.fromCol,
                    alternative.toRow,
                    alternative.toCol,
                    alternative.promotion
                );

                if (alternativeResult) {
                    movesPlayed++;
                    ambiguousHistory.length = historyIndex + 1;
                    let replayOk = true;

                    for (let replayIndex = entry.tokenIndex + 1;
                        replayIndex <= tokenIndex;
                        replayIndex++) {
                        if (game.gameOver) game.gameOver = false;
                        const replayCandidates = [];
                        const replayMove = parseSANMove(
                            moves[replayIndex],
                            game,
                            replayCandidates
                        );
                        if (!replayMove) {
                            replayOk = false;
                            break;
                        }
                        const replayResult = game.makeMove(
                            replayMove.fromRow,
                            replayMove.fromCol,
                            replayMove.toRow,
                            replayMove.toCol,
                            replayMove.promotion
                        );
                        if (!replayResult) {
                            replayOk = false;
                            break;
                        }
                        movesPlayed++;
                        if (replayCandidates.length > 1) {
                            ambiguousHistory.push({
                                moveIndex: movesPlayed - 1,
                                tokenIndex: replayIndex,
                                candidates: replayCandidates,
                                triedIndex: 0
                            });
                        }
                    }

                    if (replayOk) recovered = true;
                }
            }

            if (!recovered) {
                return {
                    valid: false,
                    reason: 'movimiento SAN no cargable',
                    tokenIndex,
                    token: sanMove,
                    movesPlayed,
                    totalMoves: moves.length
                };
            }
            continue;
        }

        const result = game.makeMove(
            parsed.fromRow,
            parsed.fromCol,
            parsed.toRow,
            parsed.toCol,
            parsed.promotion
        );
        if (!result) {
            return {
                valid: false,
                reason: 'movimiento ilegal para el motor',
                tokenIndex,
                token: sanMove,
                movesPlayed,
                totalMoves: moves.length
            };
        }

        movesPlayed++;
        if (candidates.length > 1) {
            ambiguousHistory.push({
                moveIndex: movesPlayed - 1,
                tokenIndex,
                candidates,
                triedIndex: 0
            });
        }
    }

    return { valid: movesPlayed === moves.length, movesPlayed, totalMoves: moves.length };
}

function gameIdentity(pgn, gameIndex) {
    return {
        gameIndex,
        event: extractHeader(pgn, 'Event'),
        date: extractHeader(pgn, 'Date'),
        round: extractHeader(pgn, 'Round'),
        white: extractHeader(pgn, 'White'),
        black: extractHeader(pgn, 'Black'),
        result: extractHeader(pgn, 'Result')
    };
}

function listPlayerFiles() {
    const files = fs.readdirSync(playersRoot, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => ({
            id: entry.name,
            file: path.join(playersRoot, entry.name, 'games.pgn')
        }))
        .filter(entry => fs.existsSync(entry.file))
        .filter(entry => !requestedPlayer || entry.id === requestedPlayer)
        .sort((a, b) => a.id.localeCompare(b.id));
    return shardCount
        ? files.filter((entry, index) => index % shardCount === shardIndex)
        : files;
}

function roundedSizeMB(file) {
    return Math.round((fs.statSync(file).size / 1024 / 1024) * 100) / 100;
}

function saveIndex(playerResults) {
    const counts = new Map(playerResults.map(result => [
        result.playerId,
        { gameCount: result.validGames, sizeMB: roundedSizeMB(result.file) }
    ]));
    const current = JSON.parse(fs.readFileSync(indexPath, 'utf8').replace(/^\uFEFF/, ''));
    const updated = current
        .map(entry => {
            const result = counts.get(entry.id);
            return result ? { ...entry, ...result } : entry;
        })
        .filter(entry => entry.gameCount > 0)
        .sort((a, b) => a.id.localeCompare(b.id));
    fs.writeFileSync(indexPath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
}

function shardReportPath(index, count) {
    return path.join(
        root,
        'tools',
        `invalid-player-games-report-${index}-of-${count}.json`
    );
}

if (mergeShardCount > 0) {
    const shardReports = [];
    for (let index = 0; index < mergeShardCount; index++) {
        const file = shardReportPath(index, mergeShardCount);
        shardReports.push(JSON.parse(fs.readFileSync(file, 'utf8')));
    }
    const mergedPlayers = shardReports.flatMap(report => report.playerResults);
    const mergedInvalid = shardReports.flatMap(report => report.removed);
    const merged = {
        mode: shardReports.some(report => report.mode === 'apply') ? 'apply' : 'dry-run',
        startedAt: shardReports.map(report => report.startedAt).sort()[0],
        finishedAt: shardReports.map(report => report.finishedAt).sort().at(-1),
        players: mergedPlayers.length,
        totalGames: mergedPlayers.reduce((sum, item) => sum + item.totalGames, 0),
        validGames: mergedPlayers.reduce((sum, item) => sum + item.validGames, 0),
        invalidGames: mergedInvalid.length,
        playerResults: mergedPlayers.sort((a, b) => a.playerId.localeCompare(b.playerId)),
        removed: mergedInvalid.sort((a, b) =>
            a.playerId.localeCompare(b.playerId) || a.gameIndex - b.gameIndex
        )
    };
    fs.writeFileSync(reportPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
    console.log(
        `Informes combinados: ${merged.validGames}/${merged.totalGames} válidas; ` +
        `${merged.invalidGames} ${merged.mode === 'apply' ? 'eliminadas' : 'marcadas'}.`
    );
    process.exit(0);
}

if (reindexOnly) {
    const results = listPlayerFiles().map(player => ({
        playerId: player.id,
        file: player.file,
        validGames: splitGames(fs.readFileSync(player.file, 'utf8')).length
    }));
    saveIndex(results);
    console.log(`index.json actualizado para ${results.length} jugadores.`);
    process.exit(0);
}

if (markReportApplied) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    report.mode = 'apply';
    report.appliedAt = new Date().toISOString();
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
    console.log('Informe agregado marcado como aplicado.');
    process.exit(0);
}

if (applyReport) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    if (report.mode !== 'dry-run' || !Array.isArray(report.removed)) {
        throw new Error('El informe agregado no es una revisión en seco válida.');
    }

    const removalsByPlayer = new Map();
    for (const invalid of report.removed) {
        if (!removalsByPlayer.has(invalid.playerId)) {
            removalsByPlayer.set(invalid.playerId, new Set());
        }
        removalsByPlayer.get(invalid.playerId).add(invalid.gameIndex);
    }

    const results = [];
    let removedCount = 0;
    for (const player of listPlayerFiles()) {
        const games = splitGames(fs.readFileSync(player.file, 'utf8'));
        const removals = removalsByPlayer.get(player.id) || new Set();
        const valid = games.filter((game, gameIndex) => !removals.has(gameIndex));
        if (removals.size > 0) {
            if (games.length - valid.length !== removals.size) {
                throw new Error(`El informe ya no coincide con ${player.id}.`);
            }
            fs.writeFileSync(
                player.file,
                valid.length ? valid.join('\n\n') + '\n' : '',
                'utf8'
            );
        }
        removedCount += removals.size;
        results.push({
            playerId: player.id,
            file: player.file,
            totalGames: games.length,
            validGames: valid.length,
            removedGames: removals.size
        });
    }

    if (removedCount !== report.invalidGames) {
        throw new Error(
            `El informe contiene ${report.invalidGames} partidas, pero se localizaron ${removedCount}.`
        );
    }

    saveIndex(results);
    report.mode = 'apply';
    report.appliedAt = new Date().toISOString();
    report.playerResults = results;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
    console.log(`${removedCount} partidas eliminadas; index.json actualizado.`);
    process.exit(0);
}

const startedAt = new Date();
const playerResults = [];
const invalidGames = [];

for (const [playerIndex, player] of listPlayerFiles().entries()) {
    const raw = fs.readFileSync(player.file, 'utf8');
    const games = splitGames(raw);
    const valid = [];
    const invalid = [];

    for (let gameIndex = 0; gameIndex < games.length; gameIndex++) {
        const validation = validateGame(games[gameIndex]);
        if (validation.valid) {
            valid.push(games[gameIndex]);
        } else {
            invalid.push({
                playerId: player.id,
                ...gameIdentity(games[gameIndex], gameIndex),
                ...validation
            });
        }
    }

    if (apply && invalid.length > 0) {
        fs.writeFileSync(
            player.file,
            valid.length ? valid.join('\n\n') + '\n' : '',
            'utf8'
        );
    }

    invalidGames.push(...invalid);
    playerResults.push({
        playerId: player.id,
        file: player.file,
        totalGames: games.length,
        validGames: valid.length,
        removedGames: invalid.length
    });

    process.stdout.write(
        `[${playerIndex + 1}] ${player.id}: ${valid.length}/${games.length}` +
        (invalid.length ? ` (${invalid.length} inválidas)` : '') + '\n'
    );
}

if (apply && !requestedPlayer && !shardCount) saveIndex(playerResults);

const report = {
    mode: apply ? 'apply' : 'dry-run',
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    players: playerResults.length,
    totalGames: playerResults.reduce((sum, item) => sum + item.totalGames, 0),
    validGames: playerResults.reduce((sum, item) => sum + item.validGames, 0),
    invalidGames: invalidGames.length,
    playerResults,
    removed: invalidGames
};

const outputReportPath = shardCount
    ? shardReportPath(shardIndex, shardCount)
    : requestedPlayer
        ? path.join(
            root,
            'tools',
            `invalid-player-games-report-${requestedPlayer.replace(/[^a-z0-9-]/gi, '-')}.json`
        )
        : reportPath;
fs.writeFileSync(outputReportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(
    `\n${apply ? 'Limpieza aplicada' : 'Revisión en seco'}: ` +
    `${report.validGames}/${report.totalGames} válidas; ` +
    `${report.invalidGames} ${apply ? 'eliminadas' : 'marcadas'}.\n` +
    `Informe: ${outputReportPath}`
);
