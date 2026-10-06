# Central de Chamadas

## Testar localmente (Windows)

1. Instale o Node.js LTS: https://nodejs.org
2. Na pasta do projeto, abra o terminal e rode `npm run iniciar`.

Na primeira execução as dependências são instaladas. O navegador abre sozinho em http://localhost:3000. Painel da TV: http://localhost:3000/painel.

Sem `DATABASE_URL`, os dados ficam em um banco local na pasta `.data/` (apague a pasta para zerar). Para usar o Neon, crie `.env.local` com `DATABASE_URL=<connection string>`.

## Outros sistemas

```bash
pnpm install
pnpm dev
```
