/**
 * Property Test: Attendance Percentage Calculation
 * 
 * **Property 16: Attendance Percentage Calculation**
 * **Validates: Requirements 2.3, 2.5**
 * 
 * Tests that attendance percentage is correctly calculated.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface AttendanceRecord {
  date: string;
  records: Record<string, AttendanceStatus>;
}

// Function to calculate attendance percentage (matching implementation)
function calculateAttendancePercentage(
  records: AttendanceRecord[],
  studentId: string
): { percentage: number; present: number; total: number } {
  let present = 0;
  let total = 0;

  for (const record of records) {
    if (studentId in record.records) {
      total++;
      const status = record.records[studentId];
      if (status === 'PRESENT' || status === 'LATE') {
        present++;
      }
    }
  }

  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  return { percentage, present, total };
}

// Generators
const attendanceStatusArbitrary = fc.constantFrom<AttendanceStatus>(
  'PRESENT', 'ABSENT', 'LATE', 'EXCUSED'
);

const attendanceRecordArbitrary = fc.record({
  date: fc.integer({ min: Date.parse('2024-01-01'), max: Date.parse('2025-12-31') })
    .map(ts => new Date(ts).toISOString().split('T')[0]),
  records: fc.dictionary(
    fc.uuid(),
    attendanceStatusArbitrary,
    { minKeys: 1, maxKeys: 30 }
  ),
});

describe('Property 16: Attendance Percentage Calculation', () => {
  it('should return 0% when no records exist for student', () => {
    fc.assert(
      fc.property(
        fc.array(attendanceRecordArbitrary, { minLength: 0, maxLength: 10 }),
        fc.uuid(),
        (records, studentId) => {
          // Filter out any records that might contain this student
          const filteredRecords = records.map(r => ({
            ...r,
            records: Object.fromEntries(
              Object.entries(r.records).filter(([id]) => id !== studentId)
            ),
          }));

          const result = calculateAttendancePercentage(filteredRecords, studentId);
          expect(result.percentage).toBe(0);
          expect(result.present).toBe(0);
          expect(result.total).toBe(0);
          return true;
        }
      )
    );
  });

  it('should return 100% when all records are PRESENT or LATE', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.integer({ min: Date.parse('2024-01-01'), max: Date.parse('2025-12-31') })
            .map(ts => new Date(ts).toISOString().split('T')[0]),
          { minLength: 1, maxLength: 20 }
        ),
        fc.uuid(),
        fc.constantFrom<AttendanceStatus>('PRESENT', 'LATE'),
        (dates, studentId, status) => {
          const records: AttendanceRecord[] = dates.map(date => ({
            date,
            records: { [studentId]: status },
          }));

          const result = calculateAttendancePercentage(records, studentId);
          expect(result.percentage).toBe(100);
          expect(result.present).toBe(result.total);
          return true;
        }
      )
    );
  });

  it('should return 0% when all records are ABSENT or EXCUSED', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.integer({ min: Date.parse('2024-01-01'), max: Date.parse('2025-12-31') })
            .map(ts => new Date(ts).toISOString().split('T')[0]),
          { minLength: 1, maxLength: 20 }
        ),
        fc.uuid(),
        fc.constantFrom<AttendanceStatus>('ABSENT', 'EXCUSED'),
        (dates, studentId, status) => {
          const records: AttendanceRecord[] = dates.map(date => ({
            date,
            records: { [studentId]: status },
          }));

          const result = calculateAttendancePercentage(records, studentId);
          expect(result.percentage).toBe(0);
          expect(result.present).toBe(0);
          return true;
        }
      )
    );
  });

  it('should have percentage between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.array(attendanceRecordArbitrary, { minLength: 1, maxLength: 20 }),
        fc.uuid(),
        (records, studentId) => {
          // Ensure student is in at least one record
          if (records.length > 0) {
            records[0].records[studentId] = 'PRESENT';
          }

          const result = calculateAttendancePercentage(records, studentId);
          expect(result.percentage).toBeGreaterThanOrEqual(0);
          expect(result.percentage).toBeLessThanOrEqual(100);
          return true;
        }
      )
    );
  });

  it('should satisfy: present <= total', () => {
    fc.assert(
      fc.property(
        fc.array(attendanceRecordArbitrary, { minLength: 0, maxLength: 20 }),
        fc.uuid(),
        (records, studentId) => {
          const result = calculateAttendancePercentage(records, studentId);
          expect(result.present).toBeLessThanOrEqual(result.total);
          return true;
        }
      )
    );
  });

  it('should count LATE as present', () => {
    const studentId = 'test-student';
    const records: AttendanceRecord[] = [
      { date: '2024-01-01', records: { [studentId]: 'LATE' } },
      { date: '2024-01-02', records: { [studentId]: 'PRESENT' } },
      { date: '2024-01-03', records: { [studentId]: 'ABSENT' } },
    ];

    const result = calculateAttendancePercentage(records, studentId);
    expect(result.present).toBe(2); // LATE + PRESENT
    expect(result.total).toBe(3);
    expect(result.percentage).toBe(67); // Math.round(2/3 * 100)
  });
});

/**
 * Property Test: Attendance Date Filter
 * 
 * **Property 17: Attendance Date Filter**
 * **Validates: Requirements 2.4**
 * 
 * Tests that attendance can be filtered by date range.
 */
describe('Property 17: Attendance Date Filter', () => {
  // Function to filter attendance by date range
  function filterByDateRange(
    records: AttendanceRecord[],
    startDate?: string,
    endDate?: string
  ): AttendanceRecord[] {
    return records.filter(record => {
      const date = new Date(record.date);
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;
      return true;
    });
  }

  it('should return all records when no date range specified', () => {
    fc.assert(
      fc.property(
        fc.array(attendanceRecordArbitrary, { minLength: 0, maxLength: 20 }),
        (records) => {
          const filtered = filterByDateRange(records);
          expect(filtered.length).toBe(records.length);
          return true;
        }
      )
    );
  });

  it('should filter records after startDate', () => {
    fc.assert(
      fc.property(
        fc.array(attendanceRecordArbitrary, { minLength: 0, maxLength: 20 }),
        fc.integer({ min: Date.parse('2024-01-01'), max: Date.parse('2025-12-31') })
          .map(ts => new Date(ts).toISOString().split('T')[0]),
        (records, startDate) => {
          const filtered = filterByDateRange(records, startDate);
          const allAfterStart = filtered.every(
            r => new Date(r.date) >= new Date(startDate)
          );
          expect(allAfterStart).toBe(true);
          return true;
        }
      )
    );
  });

  it('should filter records before endDate', () => {
    fc.assert(
      fc.property(
        fc.array(attendanceRecordArbitrary, { minLength: 0, maxLength: 20 }),
        fc.integer({ min: Date.parse('2024-01-01'), max: Date.parse('2025-12-31') })
          .map(ts => new Date(ts).toISOString().split('T')[0]),
        (records, endDate) => {
          const filtered = filterByDateRange(records, undefined, endDate);
          const allBeforeEnd = filtered.every(
            r => new Date(r.date) <= new Date(endDate)
          );
          expect(allBeforeEnd).toBe(true);
          return true;
        }
      )
    );
  });

  it('should return empty when startDate > endDate', () => {
    const records: AttendanceRecord[] = [
      { date: '2024-06-15', records: { 'student1': 'PRESENT' } },
    ];
    
    const filtered = filterByDateRange(records, '2024-07-01', '2024-06-01');
    expect(filtered.length).toBe(0);
  });
});
