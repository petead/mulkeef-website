-- Sprint 2: link properties to areas, blog metadata, area highlights

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS area_id UUID REFERENCES area_guides(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area_id);

ALTER TABLE area_translations
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'market';

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS reading_minutes INT DEFAULT 5;
