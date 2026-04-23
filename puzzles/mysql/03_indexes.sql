-- Ejecutar después de la importación para acelerar la carga masiva.

USE lichess_puzzles;

CREATE INDEX idx_rating ON lichess_puzzles (rating);
