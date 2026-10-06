# language: pt
@regressao
Funcionalidade: Aplicação de Cupons de Desconto e Regras de Frete
  Como um cliente da Verzel Store
  Quero aplicar cupons de desconto e obter benefícios de frete no carrinho
  Para calcular e pagar o valor correto das minhas compras

  Contexto:
    Dado que o sistema possui os seguintes produtos cadastrados:
      | id   | nome                    | preco  |
      | P001 | Camiseta Essencial      | 59.90  |
      | P002 | Calça Jeans Slim        | 139.90 |
      | P003 | Tênis Casual Urbano     | 189.90 |
      | P004 | Boné Aba Curva          | 49.90  |
      | P005 | Mochila Urbana 20L      | 100.00 |
      | P007 | Jaqueta Corta-Vento     | 229.90 |
      | P008 | Garrafa Térmica 750ml   | 50.00  |

  # ===========================================================================
  # REGRAS DE CUPOM DE DESCONTO (CA01, CA02, CA03, CA04, CA05)
  # ===========================================================================

  @ui @smoke @cupom
  Cenário: Aplicação bem-sucedida de cupom válido (CA01, CA09)
    Dado que o cliente adicionou 1 unidade do produto "Tênis Casual Urbano" (R$ 189,90) ao carrinho
    E o subtotal do carrinho é de R$ 189,90
    E o frete é de R$ 19,90
    Quando aplicar o cupom "BEMVINDO10"
    Então o sistema deve conceder um desconto de R$ 18,99 (10% sobre o subtotal)
    E o frete deve permanecer em R$ 19,90 (desconto não incide sobre o frete)
    E o total final calculated deve ser R$ 190,81
    E deve exibir a mensagem "Cupom aplicado: 10% de desconto nos produtos."

  @ui @cupom
  Esquema do Cenário: Validação de insensibilidade a caixa e remoção de espaços nas extremidades (CA02)
    Dado que o cliente possui o produto "Mochila Urbana 20L" (R$ 100,00) no carrinho
    Quando aplicar o cupom de desconto "<cupom_input>"
    Então o cupom deve ser aceito com sucesso
    E o desconto concedido deve ser de exatamente R$ 10,00

    Exemplos:
      | cupom_input        | descricao                          |
      | BEMVINDO10         | Padrão maiúsculo                   |
      | bemvindo10         | Minúsculo                          |
      | BemVindo10         | Caixa mista (CamelCase)            |
      | " BEMVINDO10"      | Espaço em branco no início          |
      | "BEMVINDO10 "      | Espaço em branco no fim            |
      | "  bemvindo10  "   | Espaços nas pontas e em minúsculo  |

  @ui @cupom
  Cenário: Tentativa de aplicar segundo cupom sem remover o primeiro (CA05 - Corrigido)
    Dado que o cliente adicionou o produto "Mochila Urbana 20L" (R$ 100,00) ao carrinho
    E já possui o cupom "BEMVINDO10" aplicado (Desconto de R$ 10,00)
    Quando o cliente tentar aplicar um novo cupom "OUTROCUPOM10" sem remover o anterior
    Então a interface deve impedir a aplicação simultânea do segundo cupom
    E deve informar que é necessário remover o cupom atual para aplicar outro

  @ui @cupom
  Cenário: Tentativa de aplicação de cupom inexistente (CA03)
    Dado que o cliente possui 1 unidade de "Calça Jeans Slim" (R$ 139,90) e frete R$ 19,90 no carrinho (Total: R$ 159,80)
    Quando aplicar o cupom "CUPOMINEXISTENTE"
    Então o sistema não deve aplicar nenhum desconto (R$ 0,00)
    E o total do carrinho deve permanecer R$ 159,80
    E deve exibir a mensagem de erro "Cupom inválido."

  @ui @cupom
  Cenário: Tentativa de aplicação de cupom expirado (CA04)
    Dado que o cliente possui 1 unidade de "Calça Jeans Slim" (R$ 139,90) e frete R$ 19,90 no carrinho (Total: R$ 159,80)
    Quando aplicar o cupom "VERAO2026"
    Então o sistema não deve aplicar nenhum desconto (R$ 0,00)
    E o total do carrinho deve permanecer R$ 159,80
    E deve exibir a mensagem de erro "Cupom expirado."

  # ===========================================================================
  # ANÁLISE DE VALOR LIMITE (AVL) - FRETE E FRETE GRÁTIS (CA06, CA07, CA08)
  # ===========================================================================

  @ui @frete @limite
  Esquema do Cenário: Validação do limiar de Frete Grátis por Análise de Valor Limite
    Dado que o cliente possui produtos no carrinho totalizando um subtotal de R$ <subtotal>
    Quando o cliente visualizar o resumo do carrinho
    Então o valor do frete deve ser R$ <frete_esperado>
    E o valor faltante para frete grátis deve ser R$ <faltante_esperado>
    E o indicador de frete grátis deve estar <status_frete_gratis>

    Exemplos:
      | subtotal | frete_esperado | faltante_esperado | status_frete_gratis | observacao                          |
      | 199.99   | 19.90          | 0.01              | desativado          | Limite superior abaixo de R$ 200,00 |
      | 200.00   | 0.00           | 0.00              | ativado             | Limite exato de isenção (CA06)      |
      | 200.01   | 0.00           | 0.00              | ativado             | Limite inferior acima de R$ 200,00  |

  @ui @frete @cupom @critico
  Cenário: Manutenção de Frete Grátis com desconto reduzindo subtotal líquido (CA08)
    Dado que o cliente possui 1 unidade de "Jaqueta Corta-Vento" (R$ 229,90) no carrinho
    E o subtotal bruto do carrinho é R$ 229,90 (Superior a R$ 200,00)
    Quando aplicar o cupom "BEMVINDO10" obtendo R$ 22,99 de desconto (Subtotal líquido passa para R$ 206,91)
    Então o frete deve permanecer em R$ 0,00 (Grátis)

  @ui @frete @cupom @critico
  Cenário: Preservação de Frete Grátis quando o desconto leva o subtotal líquido abaixo de R$ 200,00 (CA08 - Provocador)
    Dado que o cliente possui 1 unidade de "Mochila Urbana 20L" e 2 unidades de "Camiseta Essencial" (R$ 100,00 + R$ 119,80 = Subtotal R$ 219,80)
    Quando aplicar o cupom "BEMVINDO10" gerando R$ 21,98 de desconto (Subtotal líquido passa a ser R$ 197,82)
    Então o frete deve PERMANECER R$ 0,00 (Grátis), pois a regra exige considerar o subtotal antes do desconto

  # ===========================================================================
  # LIMITE DE UNIDADES E ARREDONDAMENTO (CA10, CA11)
  # ===========================================================================

  @ui @limite @quantidade
  Cenário: Inserção de quantidade permitida no limite máximo (CA10)
    Dado que o cliente seleciona o produto "Garrafa Térmica 750ml"
    Quando definir a quantidade como 5 unidades
    Então o carrinho deve aceitar o item totalizando R$ 250,00 no subtotal

  @ui @limite @quantidade
  Cenário: Bloqueio de quantidade acima do limite máximo na Interface (CA10)
    Dado que o cliente seleciona o produto "Garrafa Térmica 750ml"
    Quando tentar selecionar 6 unidades do produto
    Então a interface deve impedir o incremento e manter a quantidade em no máximo 5 unidades

  @ui @arredondamento
  Cenário: Validação de arredondamento monetário de meia-unidade / dízima (CA11)
    Dado que o cliente adicionou 1 unidade de um item de valor R$ 33,33 ao carrinho
    Quando aplicar um cupom de 10% de desconto (Desconto teórico: R$ 3,333)
    Então o valor do desconto deve ser arredondado para exatamente R$ 3,33
    E o valor total a pagar deve ser exibido com 2 casas decimais

  # ===========================================================================
  # CONTRATO E REGRA DE NEGÓCIO DA API (SUÍTE BACKEND)
  # ===========================================================================

  @api @contrato
  Cenário: Rejeição de requisição enviando quantidade acima de 5 unidades via API (CA10)
    Dado que a API recebe uma requisição POST na rota "/api/carrinho/calcular"
    Com o payload contendo o produto "P008" e quantidade igual a 6
    Quando a requisição for processada
    Então a API deve responder com status HTTP 422 Unprocessable Entity
    E o corpo da resposta deve conter o erro "QUANTIDADE_MAXIMA_EXCEDIDA"
    E detalhar o campo afetado em "itens[0].quantidade"

  @api @pedidos
  Cenário: Processamento e confirmação de pedido válido na API
    Dado que a API recebe uma requisição POST na rota "/api/pedidos" com dados de cliente válidos
    Quando o pedido for submetido
    Então o status de resposta deve ser 201 Created
    E o corpo da resposta deve conter o número do pedido no padrão de expressão regular "^VZ-\\d{6}$"
    E a estrutura de valores (subtotal, desconto, frete e total) deve coincidir com os cálculos de carrinho
    