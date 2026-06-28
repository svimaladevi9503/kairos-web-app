// Helper to compute smart compatibility score based on user profile
export function computeCompatibility(job: any, profile: any) {
  if (!profile) return { compatibilityScore: 50, compatibilityReason: "No profile data", highlightedSkills: [] };
  
  let score = 50;
  let reasonParts: string[] = [];
  let highlightedSkills: string[] = [];

  const profileCategories = profile.suitabilityCategories || [];
  const profileSkills = profile.skills || [];
  const profileAccomms = profile.accommodationRequirements || [];

  const overlappingCategories = (job.categories || []).filter((c: any) =>
    profileCategories.includes(c)
  );
  if (overlappingCategories.length > 0) {
    score += 25;
    reasonParts.push(`Matches your preference for ${overlappingCategories.join(" & ")} support.`);
  } else {
    score -= 15;
    reasonParts.push(`Classified under ${(job.categories || []).join(", ")} which differs from your category.`);
  }

  const searchHaystack = `${job.title} ${job.description} ${job.aiSummary} ${(job.accommodations?.tooling || []).join(" ")}`.toLowerCase();
  profileSkills.forEach((skill: string) => {
    if (searchHaystack.includes(skill.toLowerCase())) {
      highlightedSkills.push(skill);
    }
  });

  if (highlightedSkills.length > 0) {
    score += Math.min(highlightedSkills.length * 10, 20);
    reasonParts.push(`Highly matches your expert skills in ${highlightedSkills.join(", ")}.`);
  } else {
    score -= 5;
    reasonParts.push("Requires general skills; review technical description for fit.");
  }

  const accommHaystack = [...(job.accommodations?.tooling || []), ...(job.accommodations?.policy || [])].map(a => a.toLowerCase());
  const matchingAccomms = profileAccomms.filter((req: string) =>
    accommHaystack.some(ja => ja.includes(req.toLowerCase()) || req.toLowerCase().includes(ja))
  );

  if (matchingAccomms.length > 0) {
    score += 15;
    reasonParts.push(`Provides your requested workspace accommodations: ${matchingAccomms.join(", ")}.`);
  }

  const finalScore = Math.max(15, Math.min(100, score));

  return {
    compatibilityScore: finalScore,
    compatibilityReason: reasonParts.join(" "),
    highlightedSkills,
  };
}
