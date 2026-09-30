# Exemplo de uso — dados fictícios

Abra a aplicação e clique em **Usar exemplo fictício** com os campos vazios. O exemplo também está disponível em [vaga.txt](examples/vaga.txt) e [curriculo.txt](examples/curriculo.txt).

## Antes de qualquer complemento

| Requisito  | Prioridade      | Resultado          | Evidência                                                                 |
| ---------- | --------------- | ------------------ | ------------------------------------------------------------------------- |
| JavaScript | Obrigatório (2) | Encontrado (1)     | JavaScript está nas habilidades e no projeto.                             |
| Git        | Obrigatório (2) | Encontrado (1)     | Git está nas habilidades e no projeto.                                    |
| React      | Obrigatório (2) | Não encontrado (0) | Não informado.                                                            |
| Docker     | Desejável (1)   | Não encontrado (0) | Não informado.                                                            |
| Front-end  | Desejável (1)   | Parcial (0,5)      | HTML/CSS/JavaScript são relacionados, sem comprovar o requisito completo. |

Cálculo: `100 × (2 + 2 + 0 + 0 + 0,5) / (2 + 2 + 2 + 1 + 1) = 56,25`, arredondado para **56%**.

Na comparação, aceitar `Resumo` → `RESUMO PROFISSIONAL` muda apenas o título. Rejeitar restaura o original. O checklist encontra contato e títulos reconhecíveis. Imagens e layout precisam de revisão humana.

## Complemento demonstrativo

Somente para explorar este exemplo fictício, selecione React e informe:

```text
Desenvolvi interfaces com React em um projeto acadêmico.
```

A inclusão exige selecionar “Sim, tenho experiência” e marcar a confirmação. Em um currículo real, só confirme se isso aconteceu de fato. A informação é anexada literalmente, sem adicionar cargo, empresa ou tempo de experiência.

Após reanalisar, React passa a encontrado: `100 × 6,5 / 8 = 81,25`, arredondado para **81%**. Docker permanece ausente e não é acrescentado ao currículo. Se escolher “Não possuo” ou “Prefiro não informar”, nenhuma informação é adicionada.

A nova análise substitui as decisões e a versão ajustada anteriores; a interface avisa isso antes da confirmação. Para finalizar, aceite as alterações desejadas, revise o texto e exporte o PDF.

## Evidências

- [Análise no desktop](screenshots/analise-desktop.png)
- [Comparação com alteração aceita](screenshots/comparacao.png)
- [Visualização mobile escura](screenshots/mobile-escuro.png)
- [Validação e publicação](validacao.md)
