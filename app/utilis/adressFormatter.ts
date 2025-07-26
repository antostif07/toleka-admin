/**
 * Formate une adresse de manière complète :
 * 1. Supprime le "plus code" de Google au début (ex: "M7C3+C27, ...").
 * 2. Supprime le nom du pays à la fin.
 *
 * @param address L'adresse brute retournée par l'API Google.
 * @param countriesToRemove Une liste des noms de pays à supprimer.
 * @returns L'adresse formatée et nettoyée.
 *
 * @example
 * // Input: "M7C3+C27, Avenue de la Montagne, Kinshasa, République démocratique du Congo"
 * // Output: "Avenue de la Montagne, Kinshasa"
 */
export function formatAddress(
  address: string,
  countriesToRemove: string[] = ['République démocratique du Congo', 'Congo']
): string {
  let cleanedAddress = address;

  // --- Étape 1 : Nettoyer le "plus code" au début ---
  // L'expression régulière cherche un motif de type "XXXX+XX, " au début de la chaîne.
  // En JS, ^ ancre au début. \w inclut lettres/chiffres/underscore.
  const plusCodeRegex = /^[\w\d+]+\+[\w\d+]+,\s/;
  if (plusCodeRegex.test(cleanedAddress)) {
    cleanedAddress = cleanedAddress.replace(plusCodeRegex, '');
  }

  // --- Étape 2 : Nettoyer le nom du pays à la fin ---
  for (const country of countriesToRemove) {
    // On doit échapper les caractères spéciaux pour le nom du pays dans la regex.
    const escapedCountry = country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // La regex cherche ", [Nom du pays]" ou juste "[Nom du pays]" à la fin ($),
    // insensible à la casse (i).
    const countryRegex = new RegExp(`(,\\s*)?${escapedCountry}\\s*$`, 'i');

    if (countryRegex.test(cleanedAddress)) {
      cleanedAddress = cleanedAddress.replace(countryRegex, '');
      break; // On a trouvé et supprimé le pays, on arrête la boucle.
    }
  }

  // --- Étape 3 : Nettoyage final ---
  // Enlève les virgules ou espaces qui pourraient rester à la fin.
  return cleanedAddress.trim().replace(/,*\s*$/, '').trim();
}