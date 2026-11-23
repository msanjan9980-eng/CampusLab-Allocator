import { describe, it, expect } from 'vitest';

const simulateGenAI = (item, time, justification, deadline) => {
  return new Promise(resolve => setTimeout(() => {
    let conflict = false;
    let message = "Resource allocated successfully.";
    let suggestion = "Booking confirmed.";
    const daysUntilDeadline = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

    if (item.status === 'In Use' || item.status === 'Maintenance') {
      conflict = true;
      message = `I detected a scheduling conflict. The ${item.name} is currently marked as ${item.status}.`;
    } else if (daysUntilDeadline <= 3 && daysUntilDeadline >= 0) {
      message = `Urgent allocation detected.`;
    }
    resolve({ conflict, message, suggestion });
  }, 10)); // <-- Added the missing closing parenthesis here!
};

describe('GenAI Scheduling Logic', () => {
  it('should detect a conflict if equipment is In Use', async () => {
    const item = { name: '3D Printer', status: 'In Use', id: 2 };
    const result = await simulateGenAI(item, '10:00', 'Test project', '2024-12-31');
    expect(result.conflict).toBe(true);
    expect(result.message).toContain('scheduling conflict');
  });

  it('should flag urgency if deadline is within 3 days', async () => {
    const item = { name: 'Microscope', status: 'Available', id: 1 };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    
    const result = await simulateGenAI(item, '10:00', 'Test project', tomorrow.toISOString());
    expect(result.message).toContain('Urgent allocation detected');
  });

  it('should approve available equipment with a far deadline', async () => {
    const item = { name: 'Microscope', status: 'Available', id: 1 };
    const result = await simulateGenAI(item, '10:00', 'Test project', '2025-12-31');
    expect(result.conflict).toBe(false);
  });
});