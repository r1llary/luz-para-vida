# Appwrite – Collections e configuração

Guia para criar o Database e as Collections do app **Luz para Vida** no Console Appwrite.

---

## 1. Variáveis de ambiente (`.env`)

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=SEU_PROJECT_ID
EXPO_PUBLIC_APPWRITE_DATABASE_ID=SEU_DATABASE_ID
EXPO_PUBLIC_APPWRITE_COLLECTION_USUARIOS=usuarios
EXPO_PUBLIC_APPWRITE_COLLECTION_CELULAS=celulas
EXPO_PUBLIC_APPWRITE_COLLECTION_MEMBROS=membros
EXPO_PUBLIC_APPWRITE_COLLECTION_RELATORIOS=relatorios
EXPO_PUBLIC_APPWRITE_BUCKET_AVATARES=SEU_BUCKET_ID
```

Enquanto `EXPO_PUBLIC_APPWRITE_PROJECT_ID` estiver vazio, o app roda offline (dados em memória).

---

## 2. Database

- Crie um Database no Console → **Databases → Create Database**
- Nome sugerido: `luz-para-vida`
- Copie o **Database ID** e coloque em `EXPO_PUBLIC_APPWRITE_DATABASE_ID`

---

## 3. Collections

> Os nomes dos atributos são **case-sensitive** — use exatamente como na tabela.

---

### 3.1 `usuarios`

Armazena o perfil de cada usuário autenticado.
**Document ID = mesmo $uid do Auth** (um documento por usuário).

| Atributo         | Tipo   | Tamanho | Obrigatório | Descrição                                    |
|------------------|--------|---------|-------------|----------------------------------------------|
| `userId`         | String | 36      | Sim         | ID do usuário Auth (mesmo valor do $uid)     |
| `nomeCompleto`   | String | 255     | Sim         | Nome completo                                |
| `email`          | String | 255     | Não         | Email (espelho do Auth)                      |
| `dataNascimento` | String | 20      | Não         | Data de nascimento AAAA-MM-DD                |
| `endereco`       | String | 500     | Não         | Endereço completo                            |
| `fotoPerfil`     | String | 36      | Não         | File ID do Storage (bucket avatares)         |
| `permissao`      | Enum   | –       | Sim         | Papel do usuário: `membro` / `lider` / `admin` |

**Campo `permissao`:** no Console, crie como tipo **String** com valores permitidos `membro`, `lider`, `admin`. Default: `membro`.

**Permissões da collection:**
- Any → nenhuma
- Users → Create, Read, Update, Delete (cada usuário acessa apenas o próprio documento)

---

### 3.2 `celulas`

Uma célula por documento. Cada célula pertence a um usuário (`userId`).

| Atributo           | Tipo    | Tamanho | Obrigatório | Descrição                          |
|--------------------|---------|---------|-------------|------------------------------------|
| `userId`           | String  | 36      | Sim         | ID do dono da célula (Auth UID)    |
| `nomeCelula`       | String  | 255     | Sim         | Nome da célula                     |
| `local`            | String  | 255     | Não         | Local do encontro                  |
| `endereco`         | String  | 500     | Não         | Endereço completo                  |
| `dia`              | String  | 100     | Não         | Dia da semana (ex: Segunda-feira)  |
| `horario`          | String  | 50      | Não         | Horário (ex: 18h)                  |
| `celulaRaiz`       | String  | 255     | Não         | Nome/referência da célula raiz     |
| `temaMinistrado`   | String  | 500     | Não         | Tema ministrado                    |
| `textoBase`        | String  | 2000    | Não         | Texto / versículo base             |
| `visitantes`       | Integer | –       | Não         | Nº de visitantes (≥ 0, default 0)  |
| `membrosPresentes` | Integer | –       | Não         | Nº de membros presentes (≥ 0)      |

**Índice obrigatório:**
- Crie um índice em `userId` (tipo: Key) — usado na query `Query.equal('userId', [userId])`.

**Permissões da collection:**
- Users → Create (qualquer autenticado pode criar)
- Users → Read, Update, Delete (só o dono, controlado via `userId` no código)

---

### 3.3 `membros`

Membros cadastrados em cada célula.

| Atributo       | Tipo   | Tamanho | Obrigatório | Descrição                         |
|----------------|--------|---------|-------------|-----------------------------------|
| `celulaId`     | String | 36      | Sim         | ID do documento da célula         |
| `nomeCompleto` | String | 255     | Sim         | Nome completo do membro           |
| `cpfRg`        | String | 20      | Não         | CPF ou RG                         |
| `email`        | String | 255     | Não         | Email                             |
| `telefone`     | String | 30      | Não         | Telefone / WhatsApp               |
| `rua`          | String | 255     | Não         | Rua                               |
| `numero`       | String | 20      | Não         | Número                            |
| `complemento`  | String | 255     | Não         | Complemento                       |
| `bairro`       | String | 150     | Não         | Bairro                            |
| `cidade`       | String | 150     | Não         | Cidade                            |
| `cep`          | String | 10      | Não         | CEP                               |
| `data`         | String | 20      | Não         | Data de nascimento (AAAA-MM-DD)   |

**Índice obrigatório:**
- Índice em `celulaId` (tipo: Key) — usado em `Query.equal('celulaId', [celulaId])`.

**Permissões da collection:**
- Users → Create, Read, Update, Delete

---

### 3.4 `relatorios`

Um documento por reunião de célula (não um por mês — um por encontro).

| Atributo             | Tipo    | Tamanho | Obrigatório | Descrição                                          |
|----------------------|---------|---------|-------------|----------------------------------------------------|
| `celulaId`           | String  | 36      | Sim         | ID do documento da célula                          |
| `dataReuniao`        | String  | 10      | Sim         | Data da reunião no formato `AAAA-MM-DD`            |
| `temaMinistrado`     | String  | 500     | Não         | Tema ministrado na reunião                         |
| `textoBase`          | String  | 2000    | Não         | Texto / versículo base                             |
| `visitantes`         | Integer | –       | Não         | Nº de visitantes (≥ 0, default 0)                  |
| `membrosPresentes`   | Integer | –       | Não         | Nº de membros presentes (calculado automaticamente)|
| `membrosPresentesIds`| String  | 5000    | Não         | JSON com array de IDs dos membros presentes        |

> **`membrosPresentesIds`** é salvo como string JSON (ex: `["id1","id2"]`). O app faz o parse automaticamente ao ler.

**Índices obrigatórios:**
- Índice em `celulaId` (tipo: Key)
- Índice em `dataReuniao` (tipo: Key) — para ordenação por data

**Permissões da collection:**
- Users → Create, Read, Update, Delete

---

## 4. Storage – Bucket `avatares`

Para fotos de perfil dos usuários.

- Crie em **Storage → Create Bucket**
- Nome: `avatares`
- Copie o **Bucket ID** e coloque em `EXPO_PUBLIC_APPWRITE_BUCKET_AVATARES`
- Permissões: Users → Create, Read, Update, Delete
- Tamanho máximo de arquivo: 5 MB
- Extensões permitidas: `jpg`, `jpeg`, `png`, `webp`

---

## 5. Resumo – IDs no `.env`

Após criar tudo no Console, preencha o `.env` com os IDs reais:

```env
EXPO_PUBLIC_APPWRITE_PROJECT_ID=abc123...
EXPO_PUBLIC_APPWRITE_DATABASE_ID=def456...
EXPO_PUBLIC_APPWRITE_COLLECTION_USUARIOS=ghi789...
EXPO_PUBLIC_APPWRITE_COLLECTION_CELULAS=jkl012...
EXPO_PUBLIC_APPWRITE_COLLECTION_MEMBROS=mno345...
EXPO_PUBLIC_APPWRITE_COLLECTION_RELATORIOS=pqr678...
EXPO_PUBLIC_APPWRITE_BUCKET_AVATARES=stu901...
```

Após salvar o `.env`, reinicie o Metro: `npx expo start -c`

---

## 6. Ordem de criação recomendada

1. Criar o **Database**
2. Criar as **4 collections** com seus atributos e índices
3. Criar o **bucket** `avatares` no Storage
4. Preencher o `.env` com todos os IDs
5. Reiniciar o Metro (`npx expo start -c`)
