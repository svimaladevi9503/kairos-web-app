import { describe, it, expect, vi } from 'vitest';
import { resolveShortLink } from './shortlink.service';
import { ShortLink } from '../../database/models/ShortLink';
import { Job } from '../../database/models/Job';

vi.mock('../../database/models/ShortLink', () => ({
  ShortLink: {
    findOne: vi.fn()
  }
}));

vi.mock('../../database/models/Job', () => ({
  Job: {
    findById: vi.fn()
  }
}));

describe('resolveShortLink', () => {
  it('should resolve active job to original URL', async () => {
    const mockLink = { code: 'a1b2', jobId: 'job123', originalUrl: 'https://example.com' };
    const mockJob = { _id: 'job123', isActive: true };
    
    vi.mocked(ShortLink.findOne).mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockLink)
    } as any);
    
    vi.mocked(Job.findById).mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockJob)
    } as any);

    const result = await resolveShortLink('a1b2');
    expect(result).toEqual({ redirectTo: 'https://example.com', decayed: false });
  });

  it('should resolve inactive job to decayed path', async () => {
    const mockLink = { code: 'a1b2', jobId: 'job123', originalUrl: 'https://example.com' };
    const mockJob = { _id: 'job123', isActive: false };
    
    vi.mocked(ShortLink.findOne).mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockLink)
    } as any);
    
    vi.mocked(Job.findById).mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockJob)
    } as any);

    const result = await resolveShortLink('a1b2');
    expect(result).toEqual({ redirectTo: '/jobs/job123?status=decayed', decayed: true });
  });

  it('should resolve missing job to decayed path', async () => {
    const mockLink = { code: 'a1b2', jobId: 'job123', originalUrl: 'https://example.com' };
    
    vi.mocked(ShortLink.findOne).mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockLink)
    } as any);
    
    vi.mocked(Job.findById).mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const result = await resolveShortLink('a1b2');
    expect(result).toEqual({ redirectTo: '/jobs/job123?status=decayed', decayed: true });
  });
});
