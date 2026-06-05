-- Run this in: https://supabase.com/dashboard/project/uzzuzrtpkhspcbuxpuqz/sql/new
-- Enables RLS on the bookings table so anonymous visitors cannot read other people's bookings.

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anonymous users (website visitors) can only INSERT (submit a booking form)
CREATE POLICY "anon_insert_only" ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users (admin) can read all bookings
CREATE POLICY "auth_select_all" ON public.bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update and delete bookings (admin use)
CREATE POLICY "auth_update_all" ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "auth_delete_all" ON public.bookings
  FOR DELETE
  TO authenticated
  USING (true);
