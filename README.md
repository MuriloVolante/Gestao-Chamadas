# Central de Chamadas

## Rodar localmente

Requisitos: Node 22+, pnpm, Docker.

```bash
pnpm install
docker compose up -d
cp .env.example .env.local
pnpm dev
```

- Atendimento: http://localhost:3000
- Painel da TV: http://localhost:3000/painel

Para usar o banco do Neon em vez do Docker, coloque a connection string em `DATABASE_URL` no `.env.local`.

Resetar o banco local: `docker compose down -v && docker compose up -d`.
