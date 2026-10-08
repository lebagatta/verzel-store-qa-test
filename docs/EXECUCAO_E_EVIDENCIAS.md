# Relatório de Execução e Evidências de Testes Manuais

Este documento registra a execução prática dos cenários de teste mapeados na Verzel Store, contendo a matriz de rastreabilidade, status de execução e evidências visuais coletadas.

---

## 1. Matriz de Rastreabilidade e Status de Execução

| ID | Critério de Aceite | Cenário de Teste | Status | Evidência |
| :--- | :--- | :--- | :---: | :--- |
| **CT-01** | CA01, CA09 | Aplicação bem-sucedida de cupom válido | **PASS** | `evidencia-ca01-ca02-cupom-sucesso.png` |
| **CT-02** | CA02 | Insensibilidade a caixa e remoção de espaços (trimming) | **PASS** | `evidencia-ca01-ca02-cupom-sucesso.png` |
| **CT-03** | CA06, CA08, CA10 | Limite de 5 unidades, Frete Grátis e Desconto Cumulativo | **PASS** | `evidencia-ca06-ca08-ca10-limite-e-frete-gratis.png` |
| **CT-04** | CA07 | Análise de Valor Limite abaixo de R$ 200,00 (Frete R$ 19,90) | **PASS** | `evidencia-ca07-limite-frete-pago.png` |
| **CT-05** | CA03, CA04 | Cupons inválidos ou expirados | **PASS** | `evidencia-ca03-ca04-cupons-invalidos.png` |
| **CT-06** | CA08 | Preservação do Frete Grátis com desconto líquido abaixo de R$ 200 | **PASS** | `evidencia-ca08-cupom-abaixo-200.png` |
| **CT-07** | Regras de Checkout | Validação e bloqueio de campos obrigatórios e formatos inválidos | **PASS** | `evidencia-checkout-validacao-campos.png` |

---

## 1.1 Execução da Suíte Automatizada (E2E - Playwright)

Além da validação manual (Dia 1), a suíte de testes end-to-end foi automatizada
com Playwright + TypeScript, cobrindo os cenários de cupom, regras de frete/
limite de unidades e carregamento da aplicação.

**Comando executado:** `npx playwright test`

**Resultado:**

\```
Running 9 tests using 2 workers

  ✓  1 …cobrar frete para subtotal de R$ 199,90 (abaixo do limite de R$ 200,00) (2.4s)
  ✓  2 …Não deve permitir ultrapassar 5 unidades do mesmo produto (2.8s)
  ✓  3 …Deve conceder frete grátis para subtotal de R$ 200,00 (limite exato) (1.6s)
  ✓  4 …Deve conceder frete grátis para subtotal acima de R$ 200,00 (1.5s)
  ✓  5 …Deve aplicar cupom de desconto com sucesso (1.6s)
  ✓  6 …Deve aceitar cupom em letras minúsculas ou com espaços (insensível) (1.3s)
  ✓  7 …Deve exibir mensagem de erro ao informar cupom inexistente (1.2s)
  ✓  8 …Deve exibir mensagem de erro ao informar cupom expirado (1.2s)
  ✓  9 …deve carregar a página inicial da loja (908ms)

  9 passed (11.3s)
\```

**Taxa de Sucesso:** 100% (9/9 cenários automatizados aprovados)

![Execução no Terminal](assets/evidencia-e2e-execucao-terminal.png)
![Relatório HTML Playwright](assets/evidencia-e2e-relatorio-html.png)

---

## 2. Galeria de Evidências

### CT-01 e CT-02: Aplicação de Cupom Válido com Trimming
![Cupom Sucesso](assets/evidencia-ca01-ca02-cupom-sucesso.png)

### CT-03: Limite Máximo de 5 Unidades e Recálculo do Frete Grátis
![Limite e Frete Grátis](assets/evidencia-ca06-ca08-ca10-limite-e-frete-gratis.png)

### CT-07: Validação de Campos no Formato do Checkout
![Validação Checkout](assets/evidencia-checkout-validacao-campos.png)

---

## 3. Resumo da Cobertura

* **Total de Cenários Executados:** 7
* **Taxa de Sucesso (Pass Rate):** 100%
* **Ambiente de Testes:** Web (Google Chrome / Chromium)