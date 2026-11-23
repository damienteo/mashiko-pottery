-- Convert Potter.style from TEXT to JSONB.
-- Non-null strings are copied into en, ja, and zh. Null stays null.

ALTER TABLE "Potter"
ALTER COLUMN "style" TYPE jsonb
USING CASE
  WHEN "style" IS NULL THEN NULL
  ELSE jsonb_build_object(
    'en', "style",
    'ja', "style",
    'zh', "style"
  )
END;
