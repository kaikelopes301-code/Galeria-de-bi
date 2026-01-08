```mermaid
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

  A0 --> A1
  A0 --> A2
  A1 --> A1a
  A1 --> A1b
  A1 --> A1c
  A1a --> A1pbip
  A1b --> A2pbip
end

%% =========================
%% PIPELINE (TOOLS)
%% =========================
subgraph P[Pipeline pbip_catalog]
  direction TB
  S1[1) Scanner / Discovery]
  S2[2) Parser Semântico]
  S3[3) Normalizer]
  S4[4) Analyzer / Governança]
  S5[5) Doc Generator (Markdown)]
  S6[6) API (FastAPI)]
  S7[7) CI/CD GitHub Actions]
end

%% =========================
%% OUTPUTS
%% =========================
subgraph O[Saídas / Output]
  direction TB
  O1[(inventory.json)]
  O2[(measures_raw.parquet)]
  O3[(measures_norm.parquet)]
  O4[(stats_frequency.csv)]
  O5[(dup_by_expression.csv)]
  O6[(naming_suggestions.csv)]
  O7[(rules_violations.csv)]
  O8[README.md raiz]
  O9[Cliente/README.md]
end

%% =========================
%% FLUXO
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
O3 --> S6
O4 --> S6
O6 --> S6
S7 --> S1
```

