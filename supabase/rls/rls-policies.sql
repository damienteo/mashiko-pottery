-- Enable RLS on the User table
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- SELECT policy: Users can read their own profile
DROP POLICY IF EXISTS "Users can read their own profile" ON public."User";
CREATE POLICY "Users can read their own profile"
  ON public."User"
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (id = auth.uid());

-- UPDATE policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public."User";
CREATE POLICY "Users can update their own profile"
  ON public."User"
  AS PERMISSIVE
  FOR UPDATE
  TO public
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- Enable RLS on the Potter table
ALTER TABLE public."Potter" ENABLE ROW LEVEL SECURITY;

-- Potter SELECT: Only the potter themselves (by "userId") or ADMIN
DROP POLICY IF EXISTS "Potter can view own data or admin" ON public."Potter";
CREATE POLICY "Potter can view own data or admin"
  ON public."Potter"
  FOR SELECT
  TO public
  USING (
    "userId" = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public."User" u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
    )
  );

-- Potter UPDATE: Only the potter themselves
DROP POLICY IF EXISTS "Potter can update own data" ON public."Potter";
CREATE POLICY "Potter can update own data"
  ON public."Potter"
  FOR UPDATE
  TO public
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());


-- Enable RLS on the Product table
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;

-- Product SELECT: Anyone can view
DROP POLICY IF EXISTS "Anyone can view products" ON public."Product";
CREATE POLICY "Anyone can view products"
  ON public."Product"
  FOR SELECT
  TO public
  USING (true);

-- Product UPDATE: Only potter who owns it
DROP POLICY IF EXISTS "Potter can update own product" ON public."Product";
CREATE POLICY "Potter can update own product"
  ON public."Product"
  FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public."Potter" p
      WHERE p.id = "potterId" AND p."userId" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Potter" p
      WHERE p.id = "potterId" AND p."userId" = auth.uid()
    )
  );

-- Product DELETE: Only potter who owns it
DROP POLICY IF EXISTS "Potter can delete own product" ON public."Product";
CREATE POLICY "Potter can delete own product"
  ON public."Product"
  FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public."Potter" p
      WHERE p.id = "potterId" AND p."userId" = auth.uid()
    )
  );

-- Product INSERT: Only potter who owns the "potterId"
DROP POLICY IF EXISTS "Potter can insert own product" ON public."Product";
CREATE POLICY "Potter can insert own product"
  ON public."Product"
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Potter" p
      WHERE p.id = "potterId" AND p."userId" = auth.uid()
    )
  );