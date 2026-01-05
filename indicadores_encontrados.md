# Mapeamento Completo de Indicadores e Métricas

Este documento apresenta um mapeamento detalhado de todos os indicadores, medidas e colunas relevantes encontrados no modelo de dados do Power BI. O objetivo é fornecer uma base sólida para a criação de templates futuros, identificando correspondências exatas, parciais e novas métricas disponíveis.

## 1. Indicadores da Lista Original (Status)

Abaixo, o status de cada indicador solicitado, indicando se foi encontrado (Exato), se existe algo similar (Similar) ou se não foi identificado no modelo (Não Encontrado).

| Indicador Solicitado | Status | Correspondência no Modelo (Tabela.Coluna/Medida) | Observação |
| :--- | :--- | :--- | :--- |
| **Risco Fornecedor** | ✅ **Exato** | `Medidas.[Risco Fornecedor]` | Medida calculada baseada no `% de Entrega`. |
| **Validade CND** | ✅ **Exato** | `CND.[Validade CND]` | Coluna na tabela `CND` (origem Excel). |
| **Status CND** | ✅ **Exato** | `CND.[Status CND]` | Referenciado no relatório, provável coluna na tabela `CND`. |
| **Status Contratos** | ⚠️ Similar | `Contratos.[Status Contrato]` | Coluna indicando status (Vigente, Arquivado, etc.). |
| **Status Documentação** | ⚠️ Similar | `Entrega de documentos.[Status]` | Coluna (Aprovado, Atrasado, Em Análise, etc.). |
| **SLA Emergencial** | ⚠️ Similar | `Contratos.[Sla]` | Coluna possui valor "Emergencial". |
| **QTD Documentos** | ⚠️ Similar | `Medidas.[Total de documentos]` | Medida de contagem de linhas. |
| **Qtd Fornecedores** | ⚠️ Similar | `Medidas.[Nº Fornecedores]` | Medida `DISTINCTCOUNT`. |
| **Status Documentação FGTS** | ⚠️ Similar | `Indicador de Risco.[% de Entrega FGTS]` | Coluna relacionada a FGTS. |
| **Grau de Risco** | ⚠️ Similar | `Indicador de Risco.[Risco]` | Coluna com classificação de risco. |
| **Vencimento de Contratos** | ⚠️ Similar | `Contratos.[Fim Vigência]` | Data de término do contrato. |
| **Risco Trabalhista** | ❌ Não Encontrado | - | - |
| **Movimentação de Contratos** | ❌ Não Encontrado | - | - |
| **Restrição de Pagamento** | ❌ Não Encontrado | - | - |
| **Histórico de contratos** | ❌ Não Encontrado | - | - |
| **Absenteísmo** | ❌ Não Encontrado | - | - |
| **Turnover** | ❌ Não Encontrado | - | - |
| **Mobilização de Previstos** | ❌ Não Encontrado | - | - |
| **Status de Gestor** | ❌ Não Encontrado | - | - |
| **Colaboradores FGTS Digital** | ❌ Não Encontrado | - | - |
| **Status de Analisador** | ❌ Não Encontrado | - | - |
| **Disparidade Efetivos** | ❌ Não Encontrado | - | - |
| **Histórico de Mobilização** | ❌ Não Encontrado | - | - |
| **SLA Mobilização** | ❌ Não Encontrado | - | - |
| **Reaproveitamento de Mobilização** | ❌ Não Encontrado | - | - |
| **Status de Fornecedor** | ❌ Não Encontrado | - | - |
| **Status de Mobilização** | ❌ Não Encontrado | - | - |
| **Status Validade CND** | ❌ Não Encontrado | - | - |
| **Emissão CND** | ❌ Não Encontrado | - | - |
| **SLA Análise** | ❌ Não Encontrado | - | - |
| **Motivo de Recusa** | ❌ Não Encontrado | - | - |
| **Tempo de Atraso Documentação** | ❌ Não Encontrado | - | - |
| **Qtd Documentos FGTS** | ❌ Não Encontrado | - | - |
| **Ocorrência de Recusa** | ❌ Não Encontrado | - | - |
| **Taxa de Reanálise** | ❌ Não Encontrado | - | - |
| **Análises de Recusas** | ❌ Não Encontrado | - | - |
| **Conformidade** | ❌ Não Encontrado | - | - |
| **Status Efetivos** | ❌ Não Encontrado | - | - |
| **Aderência** | ❌ Não Encontrado | - | - |

---

## 2. Inventário Completo de Métricas Disponíveis

Abaixo, listamos todas as medidas e colunas calculadas encontradas no modelo que podem servir como indicadores alternativos ou complementares.

### Tabela: Medidas
| Nome | Tipo | Descrição/Fórmula (Resumida) |
| :--- | :--- | :--- |
| `Risco Fornecedor` | Medida | Classifica risco (Alto, Médio, Baixo) baseado no `% de Entrega`. |
| `Total de documentos` | Medida | Contagem de linhas da tabela `Entrega de documentos`. |
| `Documentos entregues` | Medida | Soma da coluna `Contagem Entregue`. |
| `Percentual de Entrega` | Medida | Divisão: `Documentos entregues` / `Total de documentos`. |
| `Documentos Atrasados` | Medida | `Total de documentos` - `Documentos entregues`. |
| `Número de contratos` | Medida | Contagem distinta de `CNPJ-Categoria-Unidade`. |
| `Nº Fornecedores` | Medida | Contagem distinta de `Fornecedor`. |
| `Nº de Categorias` | Medida | Contagem distinta de `Categoria`. |

### Tabela: Entrega de documentos
| Nome | Tipo | Descrição |
| :--- | :--- | :--- |
| `Status` | Coluna | Status do documento (Aprovado, Atrasado, Em Análise, etc.). |
| `Contagem Entregue` | Coluna | 1 se entregue (não atrasado/recusado), 0 caso contrário. |
| `Contagem Documentos Entregues` | Coluna | 1 se Status "Ok" ou "*", 0 caso contrário. |
| `Classificação Documentos` | Coluna | Categoriza documentos FGTS (Comprovante, RT, GFD, Outros). |
| `Tipo do documento` | Coluna | Recorrente, Mobilização, Treinamento, etc. |
| `Prazo de Envio` | Coluna | Data esperada de envio. |
| `Data de Envio` | Coluna | Data real de envio. |
| `Data da Análise` | Coluna | Data de validação. |

### Tabela: Contratos
| Nome | Tipo | Descrição |
| :--- | :--- | :--- |
| `Status Contrato` | Coluna | Regular, Aguardando dados, Arquivado, etc. |
| `Sla` | Coluna | Padrão ou Emergencial. |
| `Tipo da contratação` | Coluna | Contínuo, Grandes Paradas, Eventual, etc. |
| `Vigência` | Coluna | Texto formatado com início e fim da vigência. |
| `Início Vigência` | Coluna | Data de início. |
| `Fim Vigência` | Coluna | Data de fim. |
| `Categorias Agrupadas` | Medida | Concatenação de categorias por fornecedor. |

### Tabela: CND (Origem Excel)
| Nome | Tipo | Descrição |
| :--- | :--- | :--- |
| `Validade CND` | Coluna | Data de validade. |
| `Próxima Entrega CND` | Coluna | Data da próxima entrega. |
| `Data entrega CND` | Coluna | Data de entrega realizada. |
| `Prazo de entrega CND` | Coluna | Prazo limite. |
| `Vigência` | Coluna | "Vigente" ou "Não vigente" (Calculado). |

### Tabela: Indicador de Risco
| Nome | Tipo | Descrição |
| :--- | :--- | :--- |
| `Risco` | Coluna | Classificação de risco. |
| `% de Entrega FGTS` | Coluna | Percentual associado ao FGTS. |

### Tabela: TabelaContratos
| Nome | Tipo | Descrição |
| :--- | :--- | :--- |
| `Nº de contratos` | Coluna | Contagem distinta de unidades por fornecedor/categoria. |
