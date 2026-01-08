flowchart TB
  %% =========================
  %% CONTEXTO (REPO)
  %% =========================
  subgraph R[Repositório GitHub]
    direction TB
    A0[Raiz do Repo]
    A1[Cliente A/]
    A2[Cliente B/]
    A3[...]
    A1a[Cliente A/Relatório 1/]
    A1b[Cliente A/Relatório 2/]
    A1c[Cliente A/Relatório N/]
    A1pbip[(PBIP 1)]
    A2pbip[(PBIP 2)]
    A1a --> A1pbip
    A1b --> A2pbip
  end

  %% =========================
  %% PIPELINE (TOOLS)
  %% =========================
  subgraph P[Pipeline pbip_catalog]
    direction TB

    S1[1) Scanner / Discovery\n- varre pastas\n- detecta PBIP\n- identifica cliente/relatório\n- detecta tipo do modelo]
    S2[2) Parser Semântico\n- lê model.bim (JSON)\n- lê TMDL (quando houver)\n- extrai Measures (DAX)\n- extrai metadados (opcional)]
    S3[3) Normalizer\n- padroniza nomes\n- cria chaves\n- hash da expressão (signature)\n- enriquece (tags/domínios)]
    S4[4) Analyzer / Governança\n4.1 Frequência\n4.2 Duplicados por expressão\n4.3 Sugestões de padronização\n4.4 Regras/violação de padrões]
    S5[5) Doc Generator (Markdown)\n- README raiz\n- README por cliente\n- sumários e alertas]
    S6[6) API (FastAPI) (opcional)\n- consulta catálogo\n- stats/top\n- sugestões de padronização]
    S7[7) CI/CD GitHub Actions\n- roda pipeline\n- publica outputs\n- atualiza Markdown]
  end

  %% =========================
  %% ARTEFATOS (OUTPUT)
  %% =========================
  subgraph O[Saídas / Output]
    direction TB
    O1[(output/inventory.json)]
    O2[(output/measures_raw.parquet)]
    O3[(output/measures_norm.parquet)]
    O4[(output/stats_frequency.csv)]
    O5[(output/dup_by_expression.csv)]
    O6[(output/naming_suggestions.csv)]
    O7[(output/rules_violations.csv)]
    O8[README.md (raiz)\nou CATALOGO.md]
    O9[Cliente/README.md\n(1 por cliente)]
  end

  %% =========================
  %% FLUXO PRINCIPAL
  %% =========================
  R --> S1
  S1 --> O1
  O1 --> S2
  S2 --> O2
  O2 --> S3
  S3 --> O3
  O3 --> S4
  S4 --> O4
  S4 --> O5
  S4 --> O6
  S4 --> O7
  S4 --> S5
  S5 --> O8
  S5 --> O9

  %% =========================
  %% API CONSUMINDO OUTPUTS
  %% =========================
  O3 --> S6
  O4 --> S6
  O6 --> S6

  %% =========================
  %% CI/CD
  %%
