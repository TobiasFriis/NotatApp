CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  folder_id BIGINT,
  owner_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  CONSTRAINT fk_note_folder
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
  CONSTRAINT fk_note_owner
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
