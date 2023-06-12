Run
`npm install && npm run dev`

It will run locally on
`localhost:3000`

Make sure you already run `init.sql` on your PostgreSQL Database.

List all availables endpoints will be published in this link:
`https://documenter.getpostman.com/view/9816560/2s93sdXWVQ`

Also there's some environment variables that you need to set, it's all listed in `.env.example` file

```
DB_USER= <<Postgres Username>>
DB_PASSWORD= <<Postgres Password>>
DB_DATABASE= <<Postgres Database Name>>
DB_HOST= <<Postgres Host>>
DB_PORT= <<Postgres Port>>

WOO_COMMERCE_BASE_URL= <<WooCommerce Base Url (without /wp-json*)>>
WOO_COMMERCE_CONSUMER_KEY= <<WooCommerce Auth Consumer Key>>
WOO_COMMERCE_CONSUMER_SECRET= <<WooCommerce Auth Consumer Secret>>
```
