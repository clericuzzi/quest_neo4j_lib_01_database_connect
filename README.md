# Quest Happy Path de conexão com banco de dados

## Definição

Este projeto visa ter como resultado uma lib que gerencia conexão/desconexão a uma instancia do bando de dados [Neo4j](https://neo4j.com).</br></br>

## Sua missão

Sua tarefa neste projeto é criar uma nova branch e abrir um PR para MASTER, nele você vai precisar implementar
os testes cobrindo os casos propostos no arquivo [neo4j_read.feature](./src/features/neo4j_read.feature).<br></br>

## Happy Path

Imaginando um bom gerente de projetos trabalhando neste projeto, teríamos a [EPIC](https://www.scrum.org/resources/blog/what-are-epics-and-features?gclid=CjwKCAiApvebBhAvEiwAe7mHSA7aWFP5hzdbhxVX5gPCO6OVHSLWhmXOq86kxC_OqjcRDQi9COIJjBoCfS4QAvD_BwE) responsável por manusear uma conexão com o banco de dados, geralmente a primeira tarefa é um [Happy Path](https://en.wikipedia.org/wiki/Happy_path), o arquivo [neo4j_read.feature](./src/features/neo4j_read.feature) trás os scenarios que você deverá implementar no arquivo de testes [neo4j.spec.ts](./src/lib/neo4j.spec.ts).<br></br>

## Inicialização do projeto

O arquivo [.nvmrc](./.nvmrc) define a versão do Node a ser utilizada pelo projeto. Se certifique que o [nvm](https://github.com/nvm-sh/nvm) está instalado e execute `nvm install` seguido de `nvm use`, depois basta um `npm i` para instalar as dependências e o projeto estará configurado.</br></br>

## Testes

`npm run test` executa a suite de testes do Happy Path, lembre-se de conferir o % de cobertura do código.
