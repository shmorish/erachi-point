CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE chores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  points INTEGER NOT NULL CHECK (points > 0)
);

-- 家事を後から消したりポイントを変えたりしても履歴が変わらないよう、名前とポイントをコピーして持つ
CREATE TABLE logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  chore_name TEXT NOT NULL,
  points INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name) VALUES (1, 'ユーザー1'), (2, 'ユーザー2');

INSERT INTO chores (name, points) VALUES
  ('皿洗い', 10),
  ('洗濯', 10),
  ('掃除機', 15),
  ('ゴミ出し', 5),
  ('料理', 20);
