export function appendConfirmedExperience(
  original: string,
  details: string,
  confirmed: boolean,
): string {
  if (!confirmed)
    throw new Error("Confirme que o relato é verdadeiro antes de adicioná-lo.");
  if (details.trim().length < 30)
    throw new Error("Descreva sua experiência com pelo menos 30 caracteres.");
  const updated = `${original.trim()}\n\nINFORMAÇÕES COMPLEMENTARES\n${details.trim()}`;
  if (updated.length > 30000)
    throw new Error(
      "O currículo com este relato ultrapassa 30.000 caracteres. Reduza o texto antes de adicionar.",
    );
  return updated;
}
