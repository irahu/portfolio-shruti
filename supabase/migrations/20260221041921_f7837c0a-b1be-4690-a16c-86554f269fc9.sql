-- Create a public storage bucket for resume
INSERT INTO storage.buckets (id, name, public) VALUES ('resume', 'resume', true);

-- Allow anyone to read/download the resume
CREATE POLICY "Anyone can download resume" ON storage.objects FOR SELECT USING (bucket_id = 'resume');
