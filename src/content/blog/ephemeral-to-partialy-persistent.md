---
pubDate: "Feb 8 2024"
description: "Avançando no conceito técnico de Estruturas de Dados através da adaptação de Estruturas Efêmeras em implementações Parcialmente Persistêntes"
title: "Avançando no quesito Temporal através da Persistência Parcial"

---

No post [Introdução a Estruturas de Dados Efêmeras e Persistentes](https://blog.brunoan.dev/posts/ephemeral-persistent-data-structures/) pude abordar sucintamente a diferença conceitual entre Estruturas Efêmeras e Estruturas Persistentes. Tópico também abordado foi a existência de 4 formas diferentes de Persistência. Nesse post, venho falar com mais detalhes a respeito da Persistência Parcial.

## Persistência Parcial

Vale a pena relembrar que nesse nível de persistência podemos consultar qualquer versão de uma estrutura, porém no que tange a atualizações só podem ser realizadas na última versão.

Neste nível como dito anteriormente a ideia é implementar de alguma forma uma maneira de conservar estados anteriores da estrutura, mas apenas para consultas. Sendo assim, como é possível implementar Persistência Parcial de forma eficiente?

Para essa pergunta não existe uma única resposta, ao longo do tempo novas técnicas foram introduzidas de modo a tornar o processo mais eficiente. Ainda assim vale a pena conhecer os processos adotados no passado.

#### Sequêncai de Operações

Para seguir uma linha de raciocínio e exemplificação para cada exemplo vou realizar as seguintes operações de forma sequencial:

1. Começar com a Estrutura vazia;
2. Adicionar um valor 1;
3. Adicionar um valor 2;
4. Adicionar um valor 3;
5. Alterar o valor 2 para 5;
6. Alterar o valor 5 para 9;
7. Adicionar um valor 4;
8. Remover o valor 3;
9. Remover o valor 4;
10. Remover o valor 1;
11. Remover o valor 9.

<br>

### Exemplo Efêmero

Além de descrever os métodos para se atingir a **Persistência Parcial**, uma referência deve ser estabelecida a fins de comparação. Tomaremos como parâmetro uma **Lista Encadeada** e de diferentes formas iremos transformá-la em **Parcialmente Persistente**. Mas, antes de qualquer conversão, vale representar uma Implementação Efêmera.

Para fins de simplicidade não pretendo abordar neste artigo o respectivo código  ao modelo apresentado. Apenas os tipos das estruturas e uma representação visual da estrutura após processamento de cada operação da sequência descrita acima.

Em Rust, podemos definir as estruturas com os seguintes *tipos*:

```rust
struct Node<T> {
  value: T;
  pointer: Option<Box<Node>>;
}

struct EphemeralLinkedList<T> {
  root: Option<Box<Node>>;
}
```

Tendo definido os tipos, segue a representação visual da Estrutura:

1. **Começar com a Estrutura vazia**: <br> ![ephemeral_step_01](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_01.png)

2. **Adicionar um valor 1**: <br> ![ephemeral_step_02](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_02.png)

3. **Adicionar um valor 2**: <br> ![ephemeral_step_03](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_03.png)

4. **Adicionar um valor 3**: <br> ![ephemeral_step_04](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_04.png)

5. **Alterar o valor 2 para 5**: <br> ![ephemeral_step_05](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_05.png)
  Assim que o valor é atualizada o valor 2 não estará mais disponível.

6. **Alterar o valor 5 para 9**: <br> ![ephemeral_step_06](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_06.png)
  Novamente, assim que o valor é atualizado o valor 5 não estará mais disponível.

7. **Adicionar um valor 4**: <br> ![ephemeral_step_07](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_07.png)

8. **Remover o valor 3**: <br> ![ephemeral_step_08](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_08.png)
  Ao remover o nó perde-se a informação que este antes continha.

9. **Remover o valor 4**: <br> ![ephemeral_step_09](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_09.png)

10. **Remover o valor 1**: <br> ![ephemeral_step_10](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_10.png)

11. **Remover o valor 9**: <br> ![ephemeral_step_11](../../../assets/ephemeral-to-partialy-persistent/ephemeral_step_11.png)


Perceba que a medida que alterações ou deleções são realizadas a informação anterior é perdida. De modo que tendo sido feita uma operação de remoção para cada operação de inserção a Estrutura de Dados ao final do processo está vazia.

Majoritariamente as utilizações de Estruturas de Dados não tem problemas com esta perca de dados. Mas caso haja, quem quer que utilize essa implementação terá dificuldades para lidar com isso.

Tendo isso em vista, é hora de abordar um dos primeiros métodos utilizados para atingir **Persistência Parcial**, descrito por Overmars no , segue o método das Cópias.

### Método das Cópias

O método mais primitivo possível para implementar a **Persistência Parcial**, consiste em gerar cópias da estrutura para cada alteração realizada e manter uma lista de versões que disponibilize consultas para toda e qualquer versão desejada.

Neste método a estrutura dos *Nodes* utilizados não sofrerão alterações, em comparação com Modelo Efêmero, permanecendo como:

```rust
struct Node<T> {
  value: T;
  pointer: Option<Box<Node>>;
}
```

Diferentemente da Estrutura Efêmera utilizando-se deste método não podemos ter uma *root* que aponte para um nó, visto que para cada alteração uma nova cópia da estrutura é armazenada.

Para manter acesso de cada cópia individualmente podemos utilizar um Array, cada índice correspondendo a uma versão, ou então caso as versões sejam definidas por texto pode-se utilizar um HashMap.


```rust
use std::colections::HashMap

struct LinkedList<T> {
  root: Option<Box<Node>>
}

struct CopyMethodLinkedList<T> {
  root: HashMap<String, LinkedList<T>>;
}
```

Tendo definido os tipos, segue a representação visual da Estrutura:

1. **Começar com a Estrutura vazia**: <br> ![copy_method_step_01](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_01.png)
  Perceba que a raiz não começa vazia, como a raiz neste cenário constitui-se de um Vetor de versões, esta então deve começar com um ítem correspondente a versão inicial da estrutura.

2. **Adicionar um valor 1**: <br> ![copy_method_step_02](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_02.png)
  Ao realizar uma operação a raiz anterior não é alterada uma nova é adicionada, com as mudanças processadas.

3. **Adicionar um valor 2**: <br> ![copy_method_step_03](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_03.png)

4. **Adicionar um valor 3**: <br> ![copy_method_step_04](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_04.png)

5. **Alterar o valor 2 para 5**: <br> ![copy_method_step_05](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_05.png)

6. **Alterar o valor 5 para 9**: <br> ![copy_method_step_06](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_06.png)

7. **Adicionar um valor 4**: <br> ![copy_method_step_07](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_07.png)

8. **Remover o valor 3**: <br> ![copy_method_step_08](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_08.png)
  Ainda que na versão mais recente o valor 3 tenha sido removido, nas versões anteriores este dado segue disponível para consultas. Apesar da operação se tratar de remoção nenhuma informação será removida ou deletada da memória.

9. **Remover o valor 4**: <br> ![copy_method_step_09](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_09.png)

10. **Remover o valor 1**: <br> ![copy_method_step_10](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_10.png)

11. **Remover o valor 9**: <br> ![copy_method_step_11](../../../assets/ephemeral-to-partialy-persistent/copy_method_step_11.png)

<br>

Nesta estrutura, toda e qualquer versão existente está disponível para consulta e para satisfazer a **Persistência Parcial** basta então restringir atualizações a última versão. Tendo isto sido feito esta implementação pode ser tida como **Parcialmente Persistente**.

Note que ao decorrer do processo de atualização, cada atualização adiciona a estrutura uma versão equivalente a versão efêmera anteriormente apresentada para tal atualização.

Como este método utiliza-se de cópias para conservar a informação. A medida que a Estrutura cresce em números de **Nodes**, a atualização realizada passa a ser cada vez menos significante comparada a quantidade de memória despendida para realizar a cópia de todo o resto da estrutura que não será modificado.

Ainda que a estrutura não venha a atingir uma quantidade exagerada de **Nodes**, o consumo de memória tende apenas a crescer mais e mais, logicamente, em quantidades proporcionais ao tamanho das versões.

Ao longo da história outros métodos foram propostos para lidar com essa questão. É hora de abordar outro dos primeiros métodos utilizados para atingir **Persistência Parcial**, descrito por Overmars no , segue o método do Histórico.

### Método do Histórico


```rust
enum Update<T> {
  ValueUpdate { from: T, to: T },
  AddUpdate { value: T },
  RemoveUpdate  { value: T }
}
```

```rust
struct LinkedListHistory<T> {
  history: Vec<Register<T>>
}
```

Tendo definido os tipos, segue a representação visual da Estrutura:


1. **Começar com a Estrutura vazia**: <br> ![history_method_step_01](../../../assets/ephemeral-to-partialy-persistent/history_method_step_01.png)

2. **Adicionar um valor 1**: <br> ![history_method_step_02](../../../assets/ephemeral-to-partialy-persistent/history_method_step_02.png)

3. **Adicionar um valor 2**: <br> ![history_method_step_03](../../../assets/ephemeral-to-partialy-persistent/history_method_step_03.png)

4. **Adicionar um valor 3**: <br> ![history_method_step_04](../../../assets/ephemeral-to-partialy-persistent/history_method_step_04.png)

5. **Alterar o valor 2 para 5**: <br> ![history_method_step_05](../../../assets/ephemeral-to-partialy-persistent/history_method_step_05.png)

6. **Alterar o valor 5 para 9**: <br> ![history_method_step_06](../../../assets/ephemeral-to-partialy-persistent/history_method_step_06.png)

7. **Adicionar um valor 4**: <br> ![history_method_step_07](../../../assets/ephemeral-to-partialy-persistent/history_method_step_07.png)

8. **Remover o valor 3**: <br> ![history_method_step_08](../../../assets/ephemeral-to-partialy-persistent/history_method_step_08.png)

9. **Remover o valor 4**: <br> ![history_method_step_09](../../../assets/ephemeral-to-partialy-persistent/history_method_step_09.png)

10. **Remover o valor 1**: <br> ![history_method_step_10](../../../assets/ephemeral-to-partialy-persistent/history_method_step_10.png)

11. **Remover o valor 9**: <br> ![history_method_step_11](../../../assets/ephemeral-to-partialy-persistent/history_method_step_11.png)



### Método Hibrido de Histórico

```rust
enum Update<T> {
  ValueUpdate { from: T, to: T },
  AddUpdate { value: T },
  RemoveUpdate  { value: T }
}

struct Step<T, const N: usize> {
  structure: LinkedList<T>,
  updates: [Update<T>, N]
}
```

```rust
struct LinkedListStep<T, const N: usize> {
  steps: Step<T, N>
}
```

Tendo definido os tipos, segue a representação visual da Estrutura:


1. **Começar com a Estrutura vazia**: <br> ![history_step_method_step_01](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_01.png)

2. **Adicionar um valor 1**: <br> ![history_step_method_step_02](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_02.png)

3. **Adicionar um valor 2**: <br> ![history_step_method_step_03](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_03.png)

4. **Adicionar um valor 3**: <br> ![history_step_method_step_04](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_04.png)

5. **Alterar o valor 2 para 5**: <br> ![history_step_method_step_05](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_05.png)

6. **Alterar o valor 5 para 9**: <br> ![history_step_method_step_06](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_06.png)

7. **Adicionar um valor 4**: <br> ![history_step_method_step_07](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_07.png)

8. **Remover o valor 3**: <br> ![history_step_method_step_08](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_08.png)

9. **Remover o valor 4**: <br> ![history_step_method_step_09](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_09.png)

10. **Remover o valor 1**: <br> ![history_step_method_step_10](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_10.png)

11. **Remover o valor 9**: <br> ![history_step_method_step_11](../../../assets/ephemeral-to-partialy-persistent/history_step_method_step_11.png)

### Um Método Mais Eficiente

Fat Node

### Um Método Ainda Mais Eficiente

Node Copying Method

## Conclusão


## Referências


































