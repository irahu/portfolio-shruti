DROP POLICY IF EXISTS "Anyone can download resume" ON storage.objects;
CREATE POLICY "Anyone can download resume file"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resume' AND name = 'shruti-resume.pdf');