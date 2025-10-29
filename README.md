# Any List app with Nestjs, Postgresql and Graphql

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Dev

1. Clone the project
2. copy `.env.template` and rename to `.env`
3. install dependencies

   ```sh
      pnpm i
   ```

4. run docker container for db

   ```sh
      docker compose up -d
   ```

5. run dev server

   ```sh
      pnpm start:dev
   ```

6. Open Apollo Studio in browser

   ```http
      localhost:3000/graphql
   ```
