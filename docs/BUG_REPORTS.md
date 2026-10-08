# Relatório de Defeitos (Bug Reports)

## Status Geral

Durante a execução completa dos testes — manuais, exploratórios e automatizados
(E2E com Playwright) — na interface da **Verzel Store**, **nenhum defeito crítico,
bloqueante ou de severidade menor foi identificado**.

Todas as regras de negócio avaliadas (cupons de desconto, limiar de frete grátis,
limite de unidades por produto, arredondamento monetário e validações de
formulário) responderam estritamente de acordo com os critérios de aceite
(CA01 ao CA11) documentados em `CENARIOS_TESTE.md`.

## Cobertura da Verificação

| Tipo de Teste | Cenários | Resultado |
| :--- | :---: | :---: |
| Manual (roteirizado) | 7 | 100% PASS |
| Exploratório (não roteirizado) | 5 | Sem defeitos encontrados |
| Automatizado (E2E - Playwright) | 9 | 100% PASS |

## Observação sobre o Ambiente

Antes de classificar qualquer comportamento como defeito, a seção "Sobre este
ambiente" da documentação da Verzel Store foi consultada, para distinguir
simplificações propositais de divergências reais. Nenhum comportamento
encontrado durante a execução se enquadrou como defeito sob esse critério.

## Conclusão

**Status: Nenhum bug reportado.** A funcionalidade está em conformidade com os
critérios de aceite documentados, com cobertura confirmada por três camadas de
verificação (manual, exploratória e automatizada).