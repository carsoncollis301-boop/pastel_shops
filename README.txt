PASTEL SHOPS — EMAIL + ID NUMBER VERIFICATION

1. Supabase: SQL Editor > New query > paste contents of supabase_update.sql > Run. This creates a NEW table shop_email_id_verifications.
2. GitHub: replace project files with the files in this ZIP, preserving public/index.html and netlify/functions/verify.js paths. Commit changes.
3. Netlify: existing Git-connected site redeploys automatically. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables exist.
4. Test: choose a price; enter valid email and 14–16 numeric digits. The same email or ID cannot be used twice in one shop, regardless of price. Different shops are independent.
5. Supabase Table Editor: shop_email_id_verifications stores email, ID Number, shop, selected price, and timestamp. Export as CSV if needed.

The two test shops retain existing Whop checkout URLs. Other shops retain their existing placeholder URLs. This ID is a custom demonstration identifier, not a payment card number.
