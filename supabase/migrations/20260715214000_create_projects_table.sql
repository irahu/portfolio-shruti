CREATE TABLE IF NOT EXISTS public.projects (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title text NOT NULL,
    category text,
    description text,
    tools text[] DEFAULT '{}'::text[],
    image text,
    link text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (Anyone can view projects)
DROP POLICY IF EXISTS "Allow public read access" ON public.projects;
CREATE POLICY "Allow public read access" ON public.projects
    FOR SELECT TO public USING (true);

-- Clean existing data to avoid duplicates
TRUNCATE public.projects;

-- Insert projects
INSERT INTO public.projects (title, category, description, tools, image, link)
VALUES
('Brand Identity – Luxe Studio', 'Branding', 'Complete brand identity design including logo, color palette, and brand guidelines for a luxury design studio.', ARRAY['Adobe Illustrator', 'Photoshop'], 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', 'https://www.behance.net'),
('Graphic Design Collection', 'Graphic Design', 'A curated set of graphic design work spanning print layouts, marketing collateral, and visual identity explorations.', ARRAY['Adobe Illustrator', 'Photoshop'], 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop', 'https://www.behance.net'),
('Social Media Campaign', 'Social Media', 'Series of social media creatives for a lifestyle brand''s seasonal campaign across Instagram and Facebook.', ARRAY['Photoshop', 'Illustrator'], 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop', 'https://www.behance.net'),
('Digital Design Collection', 'Digital Designs', 'A series of digital designs blending typography, illustration, and photo manipulation for web and social media.', ARRAY['Photoshop', 'Illustrator'], 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop', 'https://www.behance.net'),
('Event Poster Series', 'Poster Design', 'A collection of event posters featuring bold typography, vibrant color grading, and dynamic compositions.', ARRAY['Photoshop', 'Illustrator'], 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop', 'https://www.behance.net'),
('AI Generated Artworks', 'AI Generations', 'A collection of AI-generated visuals crafted through prompt engineering and creative direction, refined for cohesive, on-brand results.', ARRAY['Midjourney', 'Photoshop'], 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop', 'https://www.behance.net'),
('Branding & Visual Identity Design – Zuni', 'Graphic Design', 'A curated set of graphic design work spanning print layouts, marketing collateral, and visual identity explorations.', ARRAY['Adobe Illustrator', 'Photoshop'], 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop', 'https://www.behance.net'),
('Branding ', 'Branding graphic design', 'A curated set of graphic design work spanning print layouts, marketing collateral, and visual identity explorations.', ARRAY['Adobe Illustrator', 'Photoshop'], 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop', 'https://www.behance.net');
