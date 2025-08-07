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


-- Address
ALTER TABLE public."Address" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can read their addresses" ON public."Address";
CREATE POLICY "User can read their addresses"
  ON public."Address"
  FOR SELECT
  TO public
  USING ("userId" = auth.uid());

DROP POLICY IF EXISTS "User can manage their addresses" ON public."Address";
CREATE POLICY "User can manage their addresses"
  ON public."Address"
  FOR ALL
  TO public
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());

-- CartItem
ALTER TABLE public."CartItem" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can manage their cart items" ON public."CartItem";
CREATE POLICY "User can manage their cart items"
  ON public."CartItem"
  FOR ALL
  TO public
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());

-- Favorite
ALTER TABLE public."Favorite" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can manage their favorites" ON public."Favorite";
CREATE POLICY "User can manage their favorites"
  ON public."Favorite"
  FOR ALL
  TO public
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());

-- Inquiry
ALTER TABLE public."Inquiry" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can manage their inquiries" ON public."Inquiry";
CREATE POLICY "User can manage their inquiries"
  ON public."Inquiry"
  FOR ALL
  TO public
  USING ("userId" IS NULL OR "userId" = auth.uid())
  WITH CHECK ("userId" IS NULL OR "userId" = auth.uid());

-- Notification
ALTER TABLE public."Notification" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can access their notifications" ON public."Notification";
CREATE POLICY "User can access their notifications"
  ON public."Notification"
  FOR ALL
  TO public
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());

-- Order
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can manage their orders" ON public."Order";
CREATE POLICY "User can manage their orders"
  ON public."Order"
  FOR ALL
  TO public
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());

-- Review
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can manage their reviews" ON public."Review";
CREATE POLICY "User can manage their reviews"
  ON public."Review"
  FOR ALL
  TO public
  USING ("reviewerId" = auth.uid())
  WITH CHECK ("reviewerId" = auth.uid());

-- Report
ALTER TABLE public."Report" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can manage their reports" ON public."Report";
CREATE POLICY "User can manage their reports"
  ON public."Report"
  FOR ALL
  TO public
  USING ("reporterId" = auth.uid())
  WITH CHECK ("reporterId" = auth.uid());

-- Session
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can manage their sessions" ON public."Session";
CREATE POLICY "User can manage their sessions"
  ON public."Session"
  FOR ALL
  TO public
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());

-- UserSettings
ALTER TABLE public."UserSettings" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can manage their settings" ON public."UserSettings";
CREATE POLICY "User can manage their settings"
  ON public."UserSettings"
  FOR ALL
  TO public
  USING ("userId" = auth.uid())
  WITH CHECK ("userId" = auth.uid());

-- Payout
ALTER TABLE public."Payout" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Potter can read their payouts" ON public."Payout";
CREATE POLICY "Potter can read their payouts"
  ON public."Payout"
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public."Potter" p
      WHERE p.id = "potterId" AND p."userId" = auth.uid()
    )
  );

-- ShippingRate (public data, read only)
ALTER TABLE public."ShippingRate" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view shipping rates" ON public."ShippingRate";
CREATE POLICY "Anyone can view shipping rates"
  ON public."ShippingRate"
  FOR SELECT
  TO public
  USING (true);

-- Invoice
ALTER TABLE public."Invoice" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can access their invoice" ON public."Invoice";
CREATE POLICY "User can access their invoice"
  ON public."Invoice"
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public."Order" o
      WHERE o.id = "orderId" AND o."userId" = auth.uid()
    )
  );

-- OrderItem
ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can view their order items" ON public."OrderItem";
CREATE POLICY "User can view their order items"
  ON public."OrderItem"
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public."Order" o
      WHERE o.id = "orderId" AND o."userId" = auth.uid()
    )
  );

-- ReturnRequest
ALTER TABLE public."ReturnRequest" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can manage their return requests" ON public."ReturnRequest";
CREATE POLICY "User can manage their return requests"
  ON public."ReturnRequest"
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public."OrderItem" oi
      JOIN public."Order" o ON o.id = oi."orderId"
      WHERE oi.id = "orderItemId" AND o."userId" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."OrderItem" oi
      JOIN public."Order" o ON o.id = oi."orderId"
      WHERE oi.id = "orderItemId" AND o."userId" = auth.uid()
    )
  );

-- RefundTransaction
ALTER TABLE public."RefundTransaction" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can view their refund transactions" ON public."RefundTransaction";
CREATE POLICY "User can view their refund transactions"
  ON public."RefundTransaction"
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public."Order" o
      WHERE o.id = "orderId" AND o."userId" = auth.uid()
    )
  );

-- AuditLog (admin-only access — not exposed to users)
ALTER TABLE public."AuditLog" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read audit logs" ON public."AuditLog";
CREATE POLICY "Admins can read audit logs"
  ON public."AuditLog"
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid() AND u.role = 'ADMIN'
    )
  );

-- PromoCode (public read-only access)
ALTER TABLE public."PromoCode" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view promo codes" ON public."PromoCode";
CREATE POLICY "Anyone can view promo codes"
  ON public."PromoCode"
  FOR SELECT
  TO public
  USING (true);