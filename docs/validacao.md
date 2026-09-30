# Evidências de validação

Validação local concluída em 30/09/2026, com Node.js 24 e build de produção.

| Verificação                 | Resultado                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| TypeScript e build Vite     | Aprovados                                                                                         |
| Testes unitários            | 20 aprovados                                                                                      |
| Testes de navegador         | 8 aprovados, desktop 1440 px e mobile 320 px                                                      |
| Acessibilidade automatizada | Nenhuma violação detectada pelo axe nos estados exercitados                                       |
| Dependências (`npm audit`)  | Nenhuma vulnerabilidade reportada                                                                 |
| Formatação                  | Prettier aprovado                                                                                 |
| PDF/DOCX                    | Importação real, revisão, cancelamento e erros testados                                           |
| Integridade                 | React/Docker/AWS não são inventados; mudanças factuais são bloqueadas; relatos exigem confirmação |
| Exemplo                     | 56% inicialmente; 81% após o relato fictício confirmado sobre React                               |

As capturas em [screenshots](screenshots) foram produzidas por um navegador executando a aplicação, sem montagem visual. Os textos usados estão em [examples](examples) e não representam um candidato real.

## Publicação

A publicação é executada pelo [workflow do repositório](https://github.com/mariomoutinho/matchcv/actions/workflows/deploy.yml), após as verificações automatizadas. O endereço de entrega está no [README](../README.md). A confirmação pública de acesso será acrescentada após a primeira execução do workflow.

## Reproduzir

Execute os comandos de validação descritos no README. Para refazer as capturas, com a aplicação disponível:

```sh
node scripts/capture-evidence.mjs https://mariomoutinho.github.io/matchcv/
```

O script exige Chromium do Playwright instalado. Ele confere HTTP bem-sucedido, resultado de 56%, ausência de erros de JavaScript e largura mobile antes de gravar as capturas.
