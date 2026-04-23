-- Sustituye __CSV_PATH__ por la ruta absoluta al CSV (barras / o \\ en Windows).
-- Ejecución recomendada (habilita carga local):
--   mysql --local-infile=1 -u root -p < 02_load_data.sql
-- O desde PowerShell: ver import_puzzles.ps1

USE lichess_puzzles;

SET NAMES utf8mb4;

-- Si ves filas partidas o conteos raros, prueba LINES TERMINATED BY '\r\n'.

LOAD DATA LOCAL INFILE '__CSV_PATH__'
INTO TABLE lichess_puzzles
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '\\'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(puzzle_id, fen, moves, rating, rating_deviation, popularity, nb_plays, themes, game_url, opening_tags);
