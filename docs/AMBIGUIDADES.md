# Registro de Ambiguidades e Decisões de Design (Assumptions)

Este documento registra as premissas e interpretações assumidas durante o mapeamento de testes da Verzel Store (Card VZS-142). Como o ambiente de testes e as especificações podem apresentar pontos abertos, estas decisões garantem a rastreabilidade e a consistência dos critérios adotados.

---

### 1. Tratamento de Espaços em Branco nos Campos de Entrada (Trimming)
* **Análise:** O critério CA02 define explicitamente que espaços no início e no fim do código do cupom devem ser ignorados (*case-insensitive* e *trimming*).
* **Decisão Assumida:** Foi assumido que o mesmo comportamento de *trimming* (remoção automática de espaços acidentais) deve ser aplicado ao campo de **CEP** do cliente no formulário de checkout, garantindo que o usuário não seja bloqueado por caracteres invisíveis antes da submissão à API.

### 2. Cumulação do Desconto do Cupom com Frete Grátis
* **Análise:** O critério CA08 estabelece que o frete grátis considera o subtotal **antes** do desconto do cupom.
* **Decisão Assumida:** O desconto percentual do cupom e a isenção de frete são benefícios cumulativos. 
  * *Exemplo:* Se o subtotal do carrinho for R$ 200,00 e o cupom `BEMVINDO10` conceder R$ 20,00 de desconto, o valor líquido dos produtos cai para R$ 180,00, mas o **frete permanece grátis (R$ 0,00)**, resultando num total final de R$ 180,00.

### 3. Reavaliação Dinâmica das Regras ao Modificar o Carrinho
* **Análise:** A documentação especifica as regras de cálculo, mas não detalha explicitamente os gatilhos de atualização da interface.
* **Decisão Assumida:** Qualquer alteração na composição do carrinho (adição/remoção de produtos ou mudança na quantidade) deve disparar automaticamente e em tempo real o recálculo de:
  - Subtotal bruto e o valor faltante para atingir o frete grátis (CA07).
  - Valor nominal do desconto do cupom ativo (CA01).
  - Transição automática da taxa fixa de frete (R$ 19,90) para frete grátis (R$ 0,00) assim que o limiar de R$ 200,00 for atingido ou ultrapassado.

### 4. Feedback Visual para Limite Máximo de Unidades na Interface
* **Análise:** O critério CA10 determina que cada produto pode ter no máximo 5 unidades por pedido, tanto na interface quanto na API.
* **Decisão Assumida:** Na interface do usuário (UI), o seletor ou botão de incremento de quantidade deve ser desabilitado/bloqueado ao atingir 5 unidades do mesmo item, exibindo uma mensagem de alerta ou orientação visual, prevenindo requisições inválidas antes mesmo de consultar a API.

### 5. Opcionalidade do Campo `cupom` nas Requisições da API
* **Análise:** A documentação da API informa que o campo `cupom` é opcional no endpoint `/api/carrinho/calcular`.
* **Decisão Assumida:** Quando a requisição for enviada omitindo a chave `"cupom"`, ou enviando seu valor como `null` ou `""` (string vazia), a API deve responder com status HTTP `200 OK`, aplicando `desconto: 0` e preenchendo o objeto `cupom` indicando que nenhum desconto foi aplicado.
