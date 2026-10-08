# Verzel Store - QA Technical Challenge (Card VZS-142)

Projeto de automação e documentação de testes de garantia da qualidade para a Verzel Store, cobrindo as funcionalidades de aplicação de cupons de desconto e regras de cálculo de frete grátis.

## 📁 Estrutura do Repositório

- `docs/CENARIOS_TESTE.md`: Mapeamento de cenários de teste em formato BDD/Gherkin.
- `docs/AMBIGUIDADES.md`: Registro de interpretações e premissas assumidas.
- `docs/BUG_REPORTS.md`: Relatório detalhado dos defeitos encontrados.
- `docs/EXECUCAO_E_EVIDENCIAS.md`: Matriz de execução e evidências gráficas (testes manuais e automatizados).
- `e2e/pages/`: Page Object Model (POM) da aplicação.
- `e2e/tests/`: Especificações de teste automatizadas (Playwright + TypeScript).
- `playwright.config.ts`: Configuração da suíte (baseURL, browsers, relatórios).

## 🧪 Cobertura de Testes

| Suíte | Cenários | Status |
| :--- | :---: | :---: |
| Cupons de Desconto (`coupon.spec.ts`) | 4 | ✅ |
| Regras de Carrinho e Frete (`cart-rules.spec.ts`) | 4 | ✅ |
| Carregamento da Aplicação (`home.spec.ts`) | 1 | ✅ |
| **Total** | **9** | **100% passing** |

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior

## 🚀 Como Executar

1. Clone o repositório e instale as dependências:
```bash
   git clone https://github.com/lebagatta/verzel-store-qa-test.git
   cd verzel-store-qa-test
   npm install
```

2. (Primeira execução) Instale o navegador do Playwright:
```bash
   npx playwright install chromium
```

3. Rode a suíte de testes:
```bash
   npm test
```

4. Para rodar em modo interativo (UI Mode):
```bash
   npm run test:ui
```

5. Para visualizar o relatório HTML após a execução:
```bash
   npx playwright show-report
```

## 📊 Resultado da Última Execução
Running 9 tests using 2 workers

9 passed (11.3s)


Detalhes completos da execução e evidências visuais em [`docs/EXECUCAO_E_EVIDENCIAS.md`](docs/EXECUCAO_E_EVIDENCIAS.md).

---
*Desenvolvido por Leandro Bagatta* 
