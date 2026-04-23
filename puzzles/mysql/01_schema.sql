-- Base de datos y tabla para lichess_db_puzzle.csv
-- Cabecera: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,OpeningTags

CREATE DATABASE IF NOT EXISTS lichess_puzzles
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lichess_puzzles;

DROP TABLE IF EXISTS lichess_puzzles;

CREATE TABLE lichess_puzzles (
  puzzle_id VARCHAR(16) NOT NULL,
  fen VARCHAR(128) NOT NULL,
  moves TEXT NOT NULL,
  themes TEXT NULL,
  opening_tags TEXT NULL,
  PRIMARY KEY (puzzle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
