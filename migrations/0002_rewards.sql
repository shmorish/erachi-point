-- ごほうびと交換すると、logs にマイナスのポイントとして記録する
CREATE TABLE rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  points INTEGER NOT NULL CHECK (points > 0)
);

INSERT INTO rewards (name, points) VALUES
  ('マッサージ10分', 50),
  ('朝寝坊できる', 80),
  ('夕飯のメニューを決められる', 100);
