# Mega prompt consolidado da versão final

Este documento consolida o briefing original e as solicitações posteriores em uma instrução reproduzível. Não é uma transcrição de uma execução no Lovable. A implementação desta entrega foi feita com assistência de código no workspace e publicada pelo GitHub Actions.

> Crie uma SPA chamada MatchCV, em português, para comparar o currículo com uma vaga e preparar um currículo simples para leitura por ATS. Use React, TypeScript, Vite, componentes locais no padrão shadcn/ui, ícones Lucide e a paleta azul/slate do briefing. Não crie login, pagamentos, dashboard ou banco de currículos.
>
> Preserve a regra central: reescrever é permitido, inventar não. Não acrescente tecnologias, empresas, cargos, datas, números, certificações ou experiências não informadas. Chame o percentual de “Match estimado”, explique seu cálculo e não o apresente como probabilidade de contratação ou pontuação real de um ATS.
>
> Permita colar a vaga e o currículo, analisar, consultar palavras encontradas, parcialmente relacionadas e ausentes, ver evidências literais e sugestões. A análise local deve funcionar sem API ou chave. Informe as limitações da comparação por termos e frases. React não pode ser inferido de JavaScript; Docker ou AWS não podem aparecer no currículo gerado quando só Python foi informado.
>
> Separe requisitos obrigatórios, desejáveis e sem prioridade explícita. Reconheça títulos de seção e expressões claras. Não suponha que todo requisito seja obrigatório. Use pesos transparentes: obrigatório 2; desejável e não especificado 1. Correspondência exata vale 1, parcial 0,5 e ausente 0.
>
> Ofereça importação de PDF com texto e DOCX, inteiramente no navegador, até 5 MB, 30 páginas de PDF e 30 mil caracteres. Mostre uma prévia editável. Substitua o currículo somente após “Usar texto revisado”; falhas e cancelamentos devem preservar o texto existente. Explique PDFs digitalizados sem OCR, arquivos com senha, vazios e corrompidos. Sirva bibliotecas e workers com a própria aplicação.
>
> Mostre o original e a versão ajustada lado a lado. Proponha mudanças conservadoras de títulos e espaços, cada uma com aceitar/rejeitar. Aplique somente o que foi aceito. Valide que as linhas factuais continuam iguais. Permita edição manual posterior e bloqueie as sugestões anteriores para não sobrescrevê-la silenciosamente.
>
> Inclua checklist dinâmico de formatação: contato, títulos tradicionais, seções vazias, linhas duplicadas e sinais textuais de tabelas ou colunas. Explique que o texto extraído não permite auditar o layout completo e mantenha uma conferência visual manual.
>
> Para competências sem evidência, pergunte se há experiência real não mencionada. “Não possuo” ou “Prefiro não informar” não adicionam nada. “Sim” exige relato escrito e confirmação explícita de veracidade. Acrescente apenas o texto digitado, sem injetar automaticamente a competência da pergunta, e refaça a análise. Avise que isso substitui a versão ajustada anterior.
>
> Permita copiar e exportar a versão editada em PDF A4, de uma coluna e texto selecionável. O PDF deve conter somente o currículo. Inclua estados de carregamento, tratamento de erros, labels, foco visível, teclado, contraste e layout a partir de 320 px. Adicione modo escuro com preferência local e respeito ao tema inicial do sistema. Não persista documentos ou resultados; salve apenas a preferência de tema.
>
> Adicione um exemplo fictício para experimentar a aplicação sem dados pessoais. Teste integridade, pesos, importação real de PDF/DOCX, revisão e confirmação de experiências, PDF exportado, mobile e acessibilidade. Publique a SPA e crie um repositório público `matchcv` na conta GitHub autenticada, com CI e deploy automático, README, mega prompt original, evolução, exemplo, prints reais e evidências de execução. Não versione chaves, tokens ou senhas. Informe o link do repositório como entrega principal.
