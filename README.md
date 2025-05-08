# Pokédex

Uma aplicação web interativa que permite aos usuários explorar e interagir com Pokémon, desenvolvida como parte do curso de JavaScript Developer da DIO.

## 🚀 Funcionalidades

- **Lista de Pokémon**: Exibe uma lista paginada de Pokémon com seus detalhes básicos
- **Busca**: Permite buscar Pokémon por nome
- **Filtros por Tipo**: Filtra Pokémon por tipo (Grass, Fire, Water, etc.)
- **Favoritos**: Sistema para marcar Pokémon como favoritos
- **Detalhes**: Modal com informações detalhadas do Pokémon selecionado
- **Responsivo**: Interface adaptável para diferentes tamanhos de tela

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- PokeAPI (API pública de Pokémon)
- LocalStorage (para persistência de favoritos)

## 📋 Estrutura do Projeto

```
├── assets/
│   ├── css/
│   │   ├── global.css
│   │   └── pokedex.css
│   ├── js/
│   │   ├── main.js
│   │   ├── pokemon-model.js
│   │   └── poke-api.js
│   └── icons/
│       └── [ícones dos tipos de Pokémon]
└── index.html
```

## 🔍 Principais Características

### Interface

- Design moderno e responsivo
- Cards de Pokémon com cores baseadas em seus tipos
- Modal detalhado com informações do Pokémon
- Sistema de abas para diferentes tipos de informação

### Funcionalidades

- Paginação com botão "Load More"
- Sistema de busca em tempo real
- Filtros por tipo de Pokémon
- Sistema de favoritos com persistência local
- Exibição de estatísticas e detalhes do Pokémon

### Integração com API

- Consumo da PokeAPI para dados dos Pokémon
- Tratamento de diferentes formatos de imagem
- Carregamento assíncrono de dados

## 🎨 Estilização

- Cores dinâmicas baseadas no tipo do Pokémon
- Animações suaves para interações
- Layout responsivo usando CSS Grid e Flexbox
- Ícones personalizados para cada tipo de Pokémon

## 🔄 Fluxo de Dados

1. Carregamento inicial de Pokémon
2. Paginação com "Load More"
3. Filtros e busca em tempo real
4. Detalhes do Pokémon em modal
5. Persistência de favoritos

## 🚀 Como Executar

1. Clone o repositório
2. Abra o arquivo `index.html` em seu navegador
3. Explore a Pokédex!

## 📱 Responsividade

- Layout adaptável para diferentes tamanhos de tela
- Grid responsivo para cards de Pokémon
- Modal otimizado para dispositivos móveis

## 🔒 Armazenamento Local

- Sistema de favoritos utilizando LocalStorage
- Persistência de preferências do usuário

## 🎯 Melhorias Futuras

- Implementação da cadeia de evolução
- Lista de movimentos do Pokémon
- Mais detalhes sobre cada Pokémon
- Temas claro/escuro
- Animações de transição
