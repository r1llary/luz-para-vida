# Collections — revisão de campos

Referência para alinhar o **Console Appwrite** ao que o app grava e lê.  
Variável de ambiente da collection: **`EXPO_PUBLIC_APPWRITE_COLLECTION_USUARIOS`** (ID da tabela no projeto).

---

## Collection `usuarios`

**Identificação do documento**

| | |
|--|--|
| **Document ID** | Igual ao **`userId`** do Auth Appwrite (`$id` da conta). O app cria o documento com o mesmo ID retornado na criação do usuário. |

**Atributos** (como o código usa hoje)

| Campo | Tipo no Appwrite | Obrigatório no app | Descrição |
|-------|------------------|--------------------|-----------|
| `userId` | String | Sim | Redundante com o ID do documento; espelha o usuário Auth. |
| `nomeCompleto` | String | Sim no cadastro | Nome exibido; também sincronizado com `Account.updateName`. |
| `email` | String | Sim no cadastro | Espelho do email da conta Auth. |
| `dataNascimento` | String | Sim no cadastro | Formato **`YYYY-MM-DD`** (ISO), derivado do formulário DD/MM/AAAA. |
| `endereco` | String | Sim no cadastro | Uma única string (logradouro, número, complemento, CEP formatado — ver `buildEnderecoString`). |
| `fotoPerfil` | String | Não | ID do arquivo no **Storage** (bucket `EXPO_PUBLIC_APPWRITE_BUCKET_AVATARES`); vazio se sem foto. |
| `permissao` | String | Sim (default) | Valores usados no código: **`membro`**, **`admin`**, **`lider`**, **`colider`**. Cadastro inicial = `membro`. |
| `celulas` | Array | sim | Inicia vazio e é preenchido quando o usuário cria uma celula ou é atribuído a uma célula |

**Não ficam nesta collection**

- **Senha**: apenas no **Auth** (Appwrite Account), não no documento `usuarios`.

---

## Collection `celulas`

Variável de ambiente: **`EXPO_PUBLIC_APPWRITE_COLLECTION_CELULAS`**.

**Identificação do documento**

| | |
|--|--|
| **Document ID** | Gerado pelo Appwrite (`ID.unique()`). O app usa esse `$id` como **`celulaId`** em membros e reuniões. |

**Atributos** (como o código usa hoje — ver `createCelulaAppwrite`)

| Campo | Tipo no Appwrite | Obrigatório no app | Descrição |
|-------|------------------|--------------------|-----------|
| `userId` | String | Sim | Dono da célula (Auth `$id` de quem criou). |
| `nomeCelula` | String | Sim | Nome da célula. |
| `local` | String | Sim | Local da reunião (texto livre). |
| `endereco` | String | Sim | Endereço completo em uma string. |
| `dia` | String | Sim | Dia da semana (texto exibido no app). |
| `horario` | String | Sim | Horário (texto). |
| `celulaRaiz` | String | Não | Referência à célula “mãe” / rede (texto). |
| `membros` | Array (string) | sim (pode ser `[]`) | **Auth user IDs** (`$id` em `users`) de quem está vinculado à célula; o app acrescenta ao cadastrar um membro com `userId` no app. Alinhe à regra de negócio (ex.: perfil com permissão `membro`). |
| `imagemDestaque` | URL / string | Não | Destaque da célula (Console pode usar tipo URL). |
| `lider` | String | Sim na criação | `$id` Auth do **líder** — ao criar célula, o app define como o **usuário logado**. |
| `colider` | String | Não | `$id` Auth do **co-líder** (membro); pode ficar vazio. |
| *(no app)* | — | — | O código expõe internamente `liderUserId` / `coLiderUserId`, gravados no Appwrite como `lider` / `colider`. |
| *(reuniões)* | — | — | Não há lista de reuniões no documento da célula; reuniões referenciam a célula por `celulaId`. |


## Collection `reuniao`

Variável de ambiente (Table ID no Console): **`EXPO_PUBLIC_APPWRITE_COLLECTION_REUNIAO`** — valor típico da table: **`reuniao`**.

| Campo | Tipo no Appwrite | Obrigatório no app | Descrição |
|-------|------------------|--------------------|-----------|
| `celulaId` | String | Sim |referência da celula na qual está registrando a reunião |
| `data` | data | Sim | Data da reunião |
| `tema` | String | Sim | Tema ministrado na reunião |
| `membrosPresentes` | array | inicia vazio | Array de membros presentes. |
| `visitantes` | array | inicia vazio | referencia a collection visitantes |
| `observacoes` | text | opcional | texto livre para anotações |


## Collection `visitante`

Variável de ambiente (Table ID no Console): **`EXPO_PUBLIC_APPWRITE_COLLECTION_VISITANTE`** — valor típico da table: **`visitante`**.

| Campo | Tipo no Appwrite | Obrigatório no app | Descrição |
|-------|------------------|--------------------|-----------|
| `celulaId` | String | Sim |referência da celula na qual está registrando a reunião |
| `reuniaoId` | string | Sim | referencia a reuniao que o registrou |
| `nome` | String | Sim | Nome do visitante |
| `telefone` | string | não | telefone do visitante |
| `observacoes` | text | opcional | texto livre para anotações |