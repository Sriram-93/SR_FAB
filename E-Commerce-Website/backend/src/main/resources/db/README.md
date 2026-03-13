# Catalog Reset and Rebuild

This folder contains the full reset/rebuild generator for the Men's cotton catalog.

## Files

- `generate_new_catalog.js`: Generates SQL to delete old catalog data and rebuild categories/products/variants.
- `new_catalog.sql`: Generated SQL output (safe to regenerate anytime).

## What Gets Reset

The generated SQL clears catalog-linked tables in this order:

1. `cart`
2. `wishlist`
3. `product_variant`
4. `product`
5. `category`

It then recreates categories and inserts the new full catalog with sizes `S, M, L, XL, XXL, XXXL`.

## Generate SQL

Run from project root:

```bash
node backend/src/main/resources/db/generate_new_catalog.js > backend/src/main/resources/db/new_catalog.sql
```

## Import SQL

```bash
mysql -u <db_user> -p srfab < backend/src/main/resources/db/new_catalog.sql
```

## Validate

```sql
SELECT COUNT(*) AS categories FROM category;
SELECT COUNT(*) AS products FROM product;
SELECT COUNT(*) AS variants FROM product_variant;
SELECT sku, COUNT(*) c FROM product_variant GROUP BY sku HAVING c > 1;
SELECT pid, size, color, COUNT(*) c FROM product_variant GROUP BY pid, size, color HAVING c > 1;
```

Expected duplicate checks: zero rows.

## Notes

- Placeholder images use query-driven HD URLs from `source.unsplash.com`, with per-product signatures for separate image links.
- Product image column is short in schema, so generated URLs are intentionally compact.
- Keep a DB backup before running destructive reset SQL.
