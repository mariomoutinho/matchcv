# Evolução do pedido até a entrega

O ponto de partida foi o [mega prompt original](mega-prompt-original.md), fornecido como um arquivo de texto com uma especificação detalhada do MatchCV. A primeira implementação foi construída diretamente no workspace com assistência de código. Não houve importação/exportação de um projeto Lovable nesta sessão; a referência ao Lovable está no enunciado da entrega e não é apresentada como histórico de uso.

| Momento          | Pedido                                                       | Mudança entregue e motivo                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primeira geração | Criar o MatchCV conforme o mega prompt                       | SPA sem login; análise local; evidências; match estimado; geração conservadora; editor, copiar e PDF. A ausência de API tornou prioritário um fallback determinístico e privado. |
| Primeiro ajuste  | “adicione o botão do modo escuro”                            | Alternância no cabeçalho, cores adaptadas e persistência apenas do tema. Melhora o conforto e preserva contraste e teclado.                                                      |
| Exploração       | “me de 5 sugestões”                                          | Foram propostas importação, comparação, checklist, prioridades e perguntas sobre experiências reais.                                                                             |
| Segundo ajuste   | “implemente a primeira”                                      | Importação de PDF/DOCX com revisão explícita. Evita copiar e colar e protege o texto existente de substituição acidental.                                                        |
| Conclusão        | “implemente as outras funcionalidades”                       | Comparação com decisões individuais; checklist; prioridades com pesos; relato verdadeiro confirmado antes de reanalisar. Aumenta transparência e controle do usuário.            |
| Entrega          | Criar repositório público, fazer push, publicar e documentar | GitHub Pages e Actions; documentação dos prompts, exemplo e capturas reais com dados fictícios. Torna o projeto verificável por qualquer pessoa com o endereço.                  |

## Decisões tomadas durante a implementação

- O mínimo de entrada ficou em 30 caracteres, em vez dos 100 mostrados como exemplo no briefing, para comportar os próprios testes obrigatórios curtos.
- Sem API de IA configurada, não foi incluída reescrita semântica generativa. A versão ajustada mantém fatos e propõe títulos/espaços verificáveis; a comparação mostra essa limitação.
- A primeira pontuação usava pesos iguais. A versão final dá peso 2 aos requisitos explicitamente obrigatórios, mantendo pesos e fórmula visíveis.
- A primeira geração aplicava a formatação diretamente. Agora cada sugestão precisa ser aceita e pode ser rejeitada, preservando a autonomia do usuário.
- O checklist é de texto; não promete detectar com certeza fotografias ou colunas perdidas durante uma extração.
- Relatos confirmados viram entrada do usuário, não “fatos verificados pela IA”. O sistema não valida a veracidade no mundo real e não adiciona automaticamente o termo da pergunta.
- Foram corrigidos problemas encontrados em testes: remoção indevida do número de anos na extração, contraste de textos/notificações e foco da prévia de importação. Dependências vulneráveis da primeira instalação foram atualizadas antes da entrega.

O [prompt consolidado](mega-prompt-final.md) é a especificação reproduzível do estado final, construída a partir dessas solicitações reais. Não há alegação de que todas as evoluções já estavam no prompt inicial.
