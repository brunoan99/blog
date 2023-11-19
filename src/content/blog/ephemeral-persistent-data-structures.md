---
pubDate: Nov 19 2023
description: Introdução a Estrutura de Dados e designação de estruturas Efêmeras e Persistentes
title: Introdução a Estruturas de Dados Efêmeras e Persistentes
---
Neste artigo, pretendo abordar de modo sucinto o tópico de Estrutura de Dados e ilustrar as diferenças entre implementações Persistentes e Efêmeras, assim como destacar pontos a respeito de cada implementação.

O presente artigo não trata exclusivamente de uma Estrutura de Dados, mas sobre o tópico em geral. Majoritariamente o que neste é debatido pode ser aplicado a qualquer Estrutura de Dados.

## Estruturas de Dados

Como dito no nome são formas de se estruturar, organizar e agrupar dados para melhor utilização de recursos. Estão amplamente presentes em todo tipo de aplicação. Filas, Pilhas, Listas Encadeadas, Hash Tables, Arrays, Grafos, Árvores são exemplos de Estruturas de Dados amplamente conhecidas.

Cada estrutura possui seu modo particular de gerir os dados de modo que cada uma possa prover vantagens de acordo com a intenção de utilização. Uma Fila é uma estrutura muito eficiente quanto a inserção e remoção de dados em padrão FIFO (First In First Out, primeiro a entrar primeiro a sair), enquanto uma Pilha é muito eficiente quanto a inserção e remoção de dados em padrão FILO (First In Last Out, primeiro a entrar último a sair). Ainda que ambas as estruturas possuam vantagens acentuadas se tratando destes padrões são ineficientes se comparadas quanto a acesso randômico.

Quanto ao acesso randômico Arrays são estruturas otimizados para tais tipos de acessos, mas exigem alocação de recursos no momento de sua definição se tornando ineficientes caso não haja quantidade de inserções e remoções razoavelmente previsíveis. Ponto de destaque para Listas Encadeadas visto que a inserção de um novo elemento ocorre de maneira dinâmica na memória, podendo assim alocar e desalocar recursos no realização da operação. Entretanto Listas Encadeadas são menos eficientes que Árvores quando o assunto é ordenação.

Estes são alguns exemplos sobre como a utilização de Estruturas de Dados dependem do contexto, não existe bala de prata e tratando-se deste assunto não seria diferente. Apesar de destacar vantagens e desvantagens de algumas estruturas de Dados, a definição destas são abstrações que regem como uma estrutura deve se comportar, porém a eficiência de uma estrutura é fortemente atrelada a sua implementação.

Implementações podem variar de caso a caso, mas neste artigo gostaria de enfatizar a diferença entre implementações efêmeras e implementações persistentes.

### Estruturas Efêmeras

Estruturas de Dados Efêmeras ou Implementações Efêmeras, são aquelas que mantém apenas o Estado Presente dos Dados, ou seja, ao realizar uma operação que altere o estado a Estrutura de Dados em questão deixa de possuir o estado anterior. Observe o exemplo:

![ephemeral insert](./assets/ephemeral_add_operation.png)

No inicio temos a **Fila \[0, 1, 2, 3, 4\]**, ao realizar a operação de inserção a estrutura inicial é modificada para a **Fila \[0, 1, 2, 3, 4,  5\]**. Perceba que o Estado precedente a operação não é preservado e se torna inacessível após a operação.

Exemplo em código:
```js
let queue = new Queue([1,2,3,4]);
console.log(queue); // [1,2,3,4]
queue.insert(5);
console.log(queue); // [1,2,3,4,5]
```

Modelo mais semelhante ao utilizada em Programação Imperativa e Programação Orientada a Objetos, utilizando de mutabilidade para realizar a alteração na estrutura.
### Estruturas Persistentes

Estrutura de Dados Persistentes ou Implementações Persistentes, são aquelas que mantém o Estado Presente dos Dados e ao realizar qualquer operação que altere o estado ambas as Estruturas seguem amplamente disponíveis para utilização, ou seja, tanto a estrutura antiga segue intacta quanto é gerado uma nova que contém a alteração desejada. Observe o exemplo:

![persistent insert](./assets/persistent_add_operation.png)

No inicio temos a **Fila \[0, 1, 2, 3, 4\]**, ao realizar a operação de inserção mantemos a **Fila \[0, 1, 2, 3, 4\]** inalterada e como resultado da operação temos a nova estrutura **Fila \[0, 1, 2, 3, 4, 5\]**. Perceba que o Estado precedente a operação é preservado na fila inicial e segue tão acessível quanto o novo Estado ambos podendo ser consultados e modificados.

Exemplo em código:
```js
let queue1 = new Queue([1,2,3,4]);
console.log(queue1); // [1,2,3,4]
let queue2 = queue1.insert(5);
// ou let queue2 = Queue.insert(queue1, 5)
console.log(queue1); // [1,2,3,4]
console.log(queue2); // [1,2,3,4,5]
```

Modelo mais semelhante ao utilizada em Programação Funcional, para que ambas as versões da estrutura sigam disponíveis a implementação deve evitar a utilização de mutabilidade.

## Casos de Uso

Apesar de cada modelo de implementação suprir a abstração dos métodos de cada Estrutura de Dados, por tratar de modo distinto o Estado cada tipo de implementação possui características particulares.

Visto que armazenar o Estado seja por *duplicação*  (Implementação Persistente) ou por *referência* (Implementação Parcialmente Persistente) tem seus custos sua utilização fica restrita aos casos em que a preservação do Estado faz-se por necessária.

Tratando-se de quantidade de utilizações efetivas grande parte das Estruturas de Dados utilizadas usam de Implementações Efêmeras para prover funcionalidade com eficiência. Como exemplo Grafos são extremamente uteis para representar conexões em Redes Sociais, manter o Estado anterior a operações nesta estrutura é pouco interessante visto seu grande custo e pouca aplicabilidade da conservação.

Há alguns cenários em que manter o Estado anterior da Estrutura de Dados é extremante relevante para a aplicação, como por exemplo o caso da Estrutura de Dados denominada de Corda que permite trabalhar com longos textos de forma eficiente. Editores de texto utilizam-se dessa Estrutura implementada de modo Persistente ou Parcialmente Persistente para manter suporte a funcionalidades como desfazer e refazer.

Além de que linguagens puramente funcionais, como Haskell, podem não conter dentre de suas funcionalidade o aspecto de mutabilidade dessa forma restringindo a utilização de implementações não persistentes.

## Diferenças

A divergência entre os tipos de implementações estão claramente atreladas a forma como cada tipo trata as alterações no Estado da Estrutura de Dados. Quesito que influência diretamente a utilização de recursos para atingir as funcionalidades esperadas.

Como para satisfazer uma Implementação Persistente e manter versões anteriores amplamente disponíveis para utilização faz-se por necessário alocar mais memória frente a uma implementação Efêmera.

Não apenas alocação de memória pode fazer parte do custo de manter o versionamento como também custo de processamento e maior complexidade em sua implementação. 

## Conclusão

Sem entrar em muitos detalhes técnicos e muito específicos espero ter abordado de modo breve e suficiente para introduzir o tema. Em posts futuros pretendo abordar com mais detalhes a Persistência em Estruturas de Dados.

## Referências:

Chris Okasaki - [Purely Functional Data Structures](https://www.cs.cmu.edu/~rwh/students/okasaki.pdf) - 1996

Reema Thareja - (Data Structures Using C)[https://aa.bbs.tr/lab/cen215-data-structures/Data-Structures-Using-C-2nd-edition.pdf] - 2011

