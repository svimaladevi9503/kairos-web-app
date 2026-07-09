import { describe, it, expect } from 'vitest';
import { computeCompatibility } from './matching.service';

describe('computeCompatibility', () => {
  it('should return default score if no profile', () => {
    const job = { title: "Software Engineer", description: "Node" };
    const result = computeCompatibility(job, null);
    expect(result.compatibilityScore).toBe(50);
  });

  it('should increase score for overlapping categories and skills', () => {
    const job = { 
      title: "React Developer", 
      description: "Looking for an expert in React.",
      categories: ["Vision Impaired"]
    };
    const profile = {
      suitabilityCategories: ["Vision Impaired"],
      skills: ["React"]
    };
    const result = computeCompatibility(job, profile);
    expect(result.compatibilityScore).toBeGreaterThan(50);
    expect(result.highlightedSkills).toContain("React");
  });

  it('should apply penalty if categories differ and no skills match', () => {
    const job = { 
      title: "Backend Dev", 
      description: "Python backend",
      categories: ["Audibly Challenged"]
    };
    const profile = {
      suitabilityCategories: ["Vision Impaired"],
      skills: ["React"]
    };
    const result = computeCompatibility(job, profile);
    expect(result.compatibilityScore).toBeLessThan(50);
  });
});
