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

Publicação concluída e acesso público verificado em **2026-09-30T16:40:54.969Z** (UTC), em navegador novo sem login.

- **Aplicação:** https://mariomoutinho.github.io/matchcv/
- **Repositório público:** https://github.com/mariomoutinho/matchcv
- **Workflow da primeira publicação:** https://github.com/mariomoutinho/matchcv/actions/runs/36745709829 — concluído com sucesso.
- **Commit da aplicação validada:** `75425b53d156b97e0e1bf42fefabb5309b34ce22`.
- **HTTP:** 200; exemplo executado com match de 56%; nenhum erro de JavaScript capturado.
- **Saída e entrada:** PDF exportado e reimportado na aplicação publicada; DOCX real importado; revisão/cancelamento confirmados.
- **Capturas:** as três imagens foram refeitas usando o endereço público, em desktop e mobile escuro.

O [registro estruturado](public-verification.json) contém os resultados e o horário da verificação. O [PDF exportado](examples/curriculo-ats.pdf) é uma saída real do exemplo fictício. O [histórico de Actions](https://github.com/mariomoutinho/matchcv/actions/workflows/deploy.yml) mantém as execuções posteriores.

## Reproduzir

Execute os comandos de validação descritos no README. Para refazer as capturas, com a aplicação disponível:

```sh
node scripts/capture-evidence.mjs https://mariomoutinho.github.io/matchcv/
```

O script exige Chromium do Playwright instalado. Ele confere HTTP bem-sucedido, resultado de 56%, ausência de erros de JavaScript e largura mobile e testa exportação de PDF, reimportação de PDF e importação de DOCX. Além das capturas, grava o PDF de exemplo e o registro estruturado de verificação.
