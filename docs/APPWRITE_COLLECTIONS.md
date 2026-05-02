# Appwrite – Collections e tipagem

Use este guia para criar no **Console Appwrite** o Database e as Collections do app Luz para Vida. Depois, preencha os IDs em `src/lib/appwrite/config.js` (ou via variáveis de ambiente `EXPO_PUBLIC_*`).

---

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_APPWRITE_ENDPOINT` | URL da API (ex.: `https://cloud.appwrite.io/v1`) |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | ID do projeto (Console → Settings) |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | ID do database |
| `EXPO_PUBLIC_APPWRITE_COLLECTION_USUARIOS` | ID da collection usuários |
| `EXPO_PUBLIC_APPWRITE_COLLECTION_CELULAS` | ID da collection células |
| `EXPO_PUBLIC_APPWRITE_COLLECTION_REUNIAO` | ID da collection reuniões (`reuniao`) |
| `EXPO_PUBLIC_APPWRITE_COLLECTION_VISITANTE` | ID da collection visitantes |
| `EXPO_PUBLIC_APPWRITE_BUCKET_AVATARES` | ID do bucket de imagens |

Não há collection separada **membros**: os vínculos são o array **`membros[]`** em cada documento **`celulas`** (IDs do Auth / `usuarios`).

Copie `.env.example` para `.env` e preencha.

---

## Database

Crie um Database no Console e use o **Database ID** em `EXPO_PUBLIC_APPWRITE_DATABASE_ID`.

---

## Collections e atributos

Os nomes dos atributos devem ser **exatamente** os da tabela (case-sensitive).

### Collection: `usuarios`

**Document ID:** preferencialmente **`$uid`** (um documento por usuário Auth).

| Atributo | Tipo | Tamanho | Obrigatório | Descrição |
|----------|------|---------|-------------|-----------|
| `userId` | string | 36 | Sim | Igual ao `$id` / Auth user ID |
| `nomeCompleto` | string | 255 | Sim | Nome completo |
| `email` | string | 255 | Não | Espelho opcional do Auth |
| `dataNascimento` | string | 12 | Não | ISO `YYYY-MM-DD` |
| `endereco` | string | 500 | Não | Endereço completo |
| `fotoPerfil` | string | 36 | Não | ID do arquivo no bucket |
| `celulas` | string[] | — | Não | IDs das células (array); vazio no cadastro; preenchido ao criar célula ou ao ser vinculado |
| `permissao` | string | 20 | Não | `membro`, `admin`, `lider`, `colider` |

---

### Collection: `celulas`

| Atributo | Tipo | Tamanho | Obrigatório | Descrição |
|----------|------|---------|-------------|-----------|
| `userId` | string | 36 | Sim | Dono da célula |
| `nomeCelula` | string | 255 | Sim | Nome |
| `local` | string | 255 | Sim | Local |
| `endereco` | string | 500 | Sim | Endereço |
| `dia` | string | 100 | Sim | Dia da semana |
| `horario` | string | 50 | Sim | Horário |
| `celulaRaiz` | string | 255 | Não | Célula raiz |
| `imagemDestaque` | url ou string | — | Não | Imagem de destaque |
| `membros` | string[] | — | Não | Auth user IDs vinculados à célula |
| `lider` | string | 36 | Sim* | Auth user ID do líder (*na criação o app usa o usuário logado) |
| `colider` | string | 36 | Não | Auth user ID do co-líder (pode vazio) |
| `temaMinistrado` | string | 500 | Não | *(Legado)* |
| `textoBase` | string | 2000 | Não | *(Legado)* |
| `visitantes` | integer | — | Não | *(Legado)* |
| `membrosPresentes` | integer | — | Não | *(Legado)* |

---

### Collection: `relatorios` / `reuniao` (reuniões)

Um **documento por reunião** (não um único documento por célula).

| Atributo | Tipo | Tamanho | Obrigatório | Descrição |
|----------|------|---------|-------------|-----------|
| `celulaId` | string | 36 | Sim | ID da célula |
| `dataReuniao` | string | 10 | Sim | Data `YYYY-MM-DD` |
| `temaMinistrado` | string | 500 | Sim | Tema |
| `textoBase` | string | 2000 | Não | Texto base |
| `visitantes` | integer | — | Sim | Quantidade de visitantes (derivada da lista ou informada) |
| `visitantesDetalhes` | string | 8000 | Não | JSON: `[{ "nome": string, "telefone": string }]` — nomes/telefones dos visitantes |
| `membrosPresentes` | integer | — | Sim | Quantidade de membros presentes |
| `membrosPresentesIds` | string | 4000 | Não | JSON: array de IDs (`string[]`) dos documentos em `membros` |

**Índices sugeridos:** `celulaId`, `dataReuniao` (para listagens e relatórios).

---

## Tipagem de referência (TypeScript / modelo mental)

```ts
interface VisitanteReuniao {
  nome: string;
  telefone: string;
}

interface ReuniaoDocument {
  celulaId: string;
  dataReuniao: string;
  temaMinistrado: string;
  textoBase?: string;
  visitantes: number;
  visitantesDetalhes?: string; // JSON.stringify(VisitanteReuniao[])
  membrosPresentes: number;
  membrosPresentesIds?: string; // JSON.stringify(string[])
}

// No app (após normalização), também é exposto:
interface ReuniaoApp {
  id: string;
  celulaId: string;
  dataReuniao: string;
  temaMinistrado: string;
  textoBase?: string;
  visitantes: number;
  visitantesLista: VisitanteReuniao[];
  membrosPresentes: number;
  membrosPresentesIds: string[];
}
```

---

## IDs no código

Após criar as collections no Console, os valores em `COLLECTION_IDS` (via `.env`) devem ser os **Collection IDs** exibidos no Appwrite.

Enquanto `EXPO_PUBLIC_APPWRITE_PROJECT_ID` ou o database estiverem vazios/incompletos, o app pode usar **dados em memória** (sem persistir no Appwrite).
