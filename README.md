# Power BI (.pbip) — Template de versionamento no GitHub

Este repositório foi preparado para você **versionar projetos Power BI no formato `.pbip`** de forma simples e limpa.

## Estrutura

- `src/` → coloque aqui a pasta do seu projeto `.pbip` (a pasta que contém o arquivo `*.pbip` e as pastas `*.Dataset/` e `*.Report/`).
- `docs/` → documentação opcional (regras, decisões, dicionário de medidas, etc.).

Exemplo esperado dentro de `src/`:

```
src/
  MeuProjetoPowerBI/
    MeuProjetoPowerBI.pbip
    MeuProjetoPowerBI.Dataset/
    MeuProjetoPowerBI.Report/
    .pbi/              (será ignorado pelo git)
```

## Como usar (passo a passo)

1. **Copie** a pasta do seu projeto `.pbip` para dentro de `src/`.
2. Rode:

```bash
git add .
git commit -m "feat: adiciona projeto Power BI (.pbip)"
git push
```

## Convenção simples de commits (sugestão)

- `feat:` nova funcionalidade (medida, visual, página, regra)
- `fix:` correção
- `refactor:` reorganização sem alterar regra de negócio
- `chore:` ajustes técnicos (estrutura, docs)

## Regras importantes

- **Nunca versionar** a pasta `.pbi/` (cache do Power BI). Já está no `.gitignore`.
- Faça commits pequenos (uma mudança por commit sempre que possível).
- Salve o projeto no Power BI Desktop antes de commitar.

---

Se quiser, posso também te entregar um template com:
- padrão de branches
- checklist de PR
- documentação de medidas (DAX) e naming conventions
