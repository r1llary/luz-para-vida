# Appwrite – Collections e tipagem

Use este guia para criar no **Console Appwrite** o Database e as Collections do app Luz para Vida. Depois, preencha os IDs em `src/lib/appwrite/config.js` (ou via variáveis de ambiente).

---

## 1. Variáveis / Chaves

No projeto, configure (posteriormente) as chaves do Appwrite:

| Variável | Onde definir | Descrição |
|----------|----------------|-----------|
| `EXPO_PUBLIC_APPWRITE_ENDPOINT` | `.env` ou `config.js` | URL do Appwrite (ex: `https://cloud.appwrite.io/v1`) |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | Console → Project Settings | ID do projeto |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | Após criar o Database | ID do database |
| IDs das collections | `config.js` → `COLLECTION_IDS` | IDs de cada collection (abaixo) |

Enquanto `APPWRITE_PROJECT_ID` estiver vazio, o app usa dados em memória (sem backend).

---

## 2. Database

- **Nome sugerido:** `luz-para-vida` (ou `main`)
- Crie um Database no Console e anote o **Database ID**.
- Use esse ID em `DATABASE_ID` em `src/lib/appwrite/config.js`.

---

## 3. Collections e atributos

Crie cada collection abaixo no Database e, em seguida, os atributos com o **tipo** e **obrigatoriedade** indicados.  
Os nomes dos atributos devem ser **exatamente** os da tabela (case-sensitive).

---

### 3.1 Collection: `usuarios`

**Nome para exibição:** Usuários  
**Document ID:** Use **Document ID = $uid** (igual ao userId do Auth), para um documento por usuário logado.

| Atributo       | Tipo   | Tamanho | Obrigatório | Descrição                          |
|----------------|--------|---------|-------------|------------------------------------|
| `userId`       | string | 36      | Sim         | ID do usuário (Auth) – mesmo que $uid |
| `nomeCompleto` | string | 255     | Sim         | Nome completo do usuário           |
| `email`        | string | 255     | Não         | Email (espelho do Auth)            |

**Permissões sugeridas:**  
- Leitura: `users` (só o próprio usuário).  
- Escrita: `users` (só o próprio usuário).  
No Console, use “User” com `userId` = `request.auth.uid` para read/write.

---

### 3.2 Collection: `celulas`

**Nome para exibição:** Células

| Atributo          | Tipo    | Tamanho | Obrigatório | Descrição                    |
|-------------------|---------|---------|-------------|------------------------------|
| `userId`          | string  | 36      | Sim         | Dono da célula (Auth user ID) |
| `nomeCelula`      | string  | 255     | Sim         | Nome da célula               |
| `local`           | string  | 255     | Sim         | Local                        |
| `endereco`        | string  | 500     | Sim         | Endereço                     |
| `dia`             | string  | 100     | Sim         | Dia (ex: Segunda-feira)      |
| `horario`         | string  | 50      | Sim         | Horário (ex: 18h)            |
| `celulaRaiz`      | string  | 255     | Não         | Célula raiz                  |
| `temaMinistrado`  | string  | 500     | Não         | Tema ministrado              |
| `textoBase`       | string  | 2000    | Não         | Texto base                   |
| `visitantes`      | integer | –       | Não         | Nº de visitantes (default 0) |
| `membrosPresentes`| integer | –       | Não         | Nº de membros presentes (0+) |

**Permissões sugeridas:**  
- Create: `users` (autenticados).  
- Read/Update/Delete: usuário dono (`userId` = `request.auth.uid`).

---

### 3.3 Collection: `membros`

**Nome para exibição:** Membros

| Atributo       | Tipo   | Tamanho | Obrigatório | Descrição          |
|----------------|--------|---------|-------------|--------------------|
| `celulaId`     | string | 36      | Sim         | ID do doc. da célula |
| `nomeCompleto` | string | 255     | Sim         | Nome do membro     |
| `cpfRg`        | string | 20      | Sim         | CPF ou RG          |
| `email`        | string | 255     | Não         | Email              |
| `telefone`     | string | 30      | Não         | Telefone           |
| `rua`          | string | 255     | Não         | Rua                |
| `numero`       | string | 20      | Não         | Número             |
| `complemento`  | string | 255     | Não         | Complemento        |
| `bairro`       | string | 150     | Não         | Bairro            |
| `cidade`       | string | 150     | Não         | Cidade            |
| `cep`          | string | 10      | Não         | CEP               |
| `data`         | string | 20      | Não         | Data (ex: nasc.)  |

**Permissões sugeridas:**  
- Create: usuários autenticados.  
- Read/Update/Delete: apenas quem tem acesso à célula (ex.: dono da célula via `celulaId`).

---

### 3.4 Collection: `relatorios`

**Nome para exibição:** Relatórios  
Um documento por célula (atualizado ao salvar o relatório).

| Atributo           | Tipo    | Tamanho | Obrigatório | Descrição              |
|--------------------|---------|---------|-------------|------------------------|
| `celulaId`         | string  | 36      | Sim         | ID do doc. da célula   |
| `temaMinistrado`   | string  | 500     | Sim         | Tema ministrado        |
| `textoBase`        | string  | 2000    | Não         | Texto base             |
| `visitantes`       | integer | –       | Sim         | Nº visitantes (0+)     |
| `membrosPresentes` | integer | –       | Sim         | Nº membros presentes   |

**Permissões sugeridas:**  
- Create/Update: usuário dono da célula.  
- Read: usuário dono da célula.

---

## 4. Resumo – IDs para o `config.js`

Após criar no Console:

1. **Database** → copie o Database ID → `DATABASE_ID` (ou `EXPO_PUBLIC_APPWRITE_DATABASE_ID`).
2. **Collections** → copie cada Collection ID e preencha em `COLLECTION_IDS`:

```js
export const COLLECTION_IDS = {
  usuarios: 'COLE_O_ID_DA_COLLECTION_USUARIOS',
  celulas: 'COLE_O_ID_DA_COLLECTION_CELULAS',
  membros: 'COLE_O_ID_DA_COLLECTION_MEMBROS',
  relatorios: 'COLE_O_ID_DA_COLLECTION_RELATORIOS',
};
```

---

## 5. Tipagem (TypeScript / JSDoc)

Para referência no código (opcional):

```ts
// Usuário (Auth + documento em usuarios)
interface User {
  id: string;
  email: string;
  nomeCompleto: string;
}

// Documento da collection usuarios
interface UsuarioDocument {
  userId: string;
  nomeCompleto: string;
  email?: string;
}

// Documento da collection celulas
interface CelulaDocument {
  userId: string;
  nomeCelula: string;
  local: string;
  endereco: string;
  dia: string;
  horario: string;
  celulaRaiz?: string;
  temaMinistrado?: string;
  textoBase?: string;
  visitantes?: number;
  membrosPresentes?: number;
}

// Documento da collection membros
interface MembroDocument {
  celulaId: string;
  nomeCompleto: string;
  cpfRg: string;
  email?: string;
  telefone?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  data?: string;
}

// Documento da collection relatorios
interface RelatorioDocument {
  celulaId: string;
  temaMinistrado: string;
  textoBase?: string;
  visitantes: number;
  membrosPresentes: number;
}
```

Com as collections e o `config.js` preenchidos, o app passa a usar o Appwrite como backend.
