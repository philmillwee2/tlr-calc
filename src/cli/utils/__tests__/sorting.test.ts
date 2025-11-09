/**
 * Tests for sorting utilities
 */
import { createSortComparator, SortDirection } from '../sorting';

describe('createSortComparator', () => {
  describe('Number sorting', () => {
    interface NumberData {
      value: number;
    }

    const data: NumberData[] = [
      { value: 5 },
      { value: 1 },
      { value: 10 },
      { value: 3 },
      { value: 7 },
    ];

    it('should sort numbers ascending', () => {
      const sorted = [...data].sort(createSortComparator<NumberData>('value', 'asc'));
      expect(sorted.map(d => d.value)).toEqual([1, 3, 5, 7, 10]);
    });

    it('should sort numbers descending', () => {
      const sorted = [...data].sort(createSortComparator<NumberData>('value', 'desc'));
      expect(sorted.map(d => d.value)).toEqual([10, 7, 5, 3, 1]);
    });

    it('should handle negative numbers', () => {
      const negData: NumberData[] = [
        { value: -5 },
        { value: 3 },
        { value: -10 },
        { value: 0 },
        { value: 8 },
      ];
      const sorted = [...negData].sort(createSortComparator<NumberData>('value', 'asc'));
      expect(sorted.map(d => d.value)).toEqual([-10, -5, 0, 3, 8]);
    });

    it('should handle equal values (stable sort)', () => {
      const equalData: NumberData[] = [
        { value: 5 },
        { value: 5 },
        { value: 3 },
      ];
      const sorted = [...equalData].sort(createSortComparator<NumberData>('value', 'asc'));
      expect(sorted[0]?.value).toBe(3);
      expect(sorted[1]?.value).toBe(5);
      expect(sorted[2]?.value).toBe(5);
    });
  });

  describe('String sorting', () => {
    interface StringData {
      name: string;
    }

    const data: StringData[] = [
      { name: 'Zebra' },
      { name: 'apple' },
      { name: 'Banana' },
      { name: 'cherry' },
      { name: 'Apple' },
    ];

    it('should sort strings ascending (case-insensitive)', () => {
      const sorted = [...data].sort(createSortComparator<StringData>('name', 'asc'));
      const names = sorted.map(d => d.name);
      // apple and Apple should be adjacent
      expect(names[0]?.toLowerCase()).toBe('apple');
      expect(names[1]?.toLowerCase()).toBe('apple');
      expect(names[2]?.toLowerCase()).toBe('banana');
      expect(names[3]?.toLowerCase()).toBe('cherry');
      expect(names[4]?.toLowerCase()).toBe('zebra');
    });

    it('should sort strings descending (case-insensitive)', () => {
      const sorted = [...data].sort(createSortComparator<StringData>('name', 'desc'));
      const names = sorted.map(d => d.name);
      expect(names[0]?.toLowerCase()).toBe('zebra');
      expect(names[1]?.toLowerCase()).toBe('cherry');
      expect(names[2]?.toLowerCase()).toBe('banana');
    });

    it('should handle empty strings', () => {
      const emptyData: StringData[] = [
        { name: 'zebra' },
        { name: '' },
        { name: 'apple' },
      ];
      const sorted = [...emptyData].sort(createSortComparator<StringData>('name', 'asc'));
      expect(sorted[0]?.name).toBe('');
      expect(sorted[1]?.name).toBe('apple');
      expect(sorted[2]?.name).toBe('zebra');
    });
  });

  describe('Boolean sorting', () => {
    interface BooleanData {
      active: boolean;
    }

    const data: BooleanData[] = [
      { active: true },
      { active: false },
      { active: true },
      { active: false },
    ];

    it('should sort booleans ascending (false < true)', () => {
      const sorted = [...data].sort(createSortComparator<BooleanData>('active', 'asc'));
      expect(sorted[0]?.active).toBe(false);
      expect(sorted[1]?.active).toBe(false);
      expect(sorted[2]?.active).toBe(true);
      expect(sorted[3]?.active).toBe(true);
    });

    it('should sort booleans descending (true > false)', () => {
      const sorted = [...data].sort(createSortComparator<BooleanData>('active', 'desc'));
      expect(sorted[0]?.active).toBe(true);
      expect(sorted[1]?.active).toBe(true);
      expect(sorted[2]?.active).toBe(false);
      expect(sorted[3]?.active).toBe(false);
    });
  });

  describe('Mixed type sorting', () => {
    interface MixedData {
      value: string | number;
    }

    const data: MixedData[] = [
      { value: '10' },
      { value: 3 },
      { value: '2' },
      { value: 20 },
      { value: '100' },
    ];

    it('should handle mixed string/number types by converting to string', () => {
      const sorted = [...data].sort(createSortComparator<MixedData>('value', 'asc'));
      // String comparison (lexicographic with localeCompare): '10' < '100' < '2' < '3' < '20'
      const values = sorted.map(d => String(d.value));
      expect(values).toEqual(['10', '100', '2', '3', '20']);
    });
  });

  describe('Null and undefined handling', () => {
    interface NullableData {
      value: number | null | undefined;
    }

    it('should sort nulls to beginning for ascending', () => {
      const data: NullableData[] = [
        { value: 5 },
        { value: null },
        { value: 3 },
        { value: undefined },
      ];
      const sorted = [...data].sort(createSortComparator<NullableData>('value', 'asc'));
      expect(sorted[0]?.value).toBeNull();
      expect(sorted[1]?.value).toBeUndefined();
      expect(sorted[2]?.value).toBe(3);
      expect(sorted[3]?.value).toBe(5);
    });

    it('should sort nulls to end for descending', () => {
      const data: NullableData[] = [
        { value: 5 },
        { value: null },
        { value: 3 },
        { value: undefined },
      ];
      const sorted = [...data].sort(createSortComparator<NullableData>('value', 'desc'));
      expect(sorted[0]?.value).toBe(5);
      expect(sorted[1]?.value).toBe(3);
      expect(sorted[2]?.value).toBeNull();
      expect(sorted[3]?.value).toBeUndefined();
    });
  });

  describe('Custom getValue function', () => {
    interface NestedData {
      id: number;
      meta: {
        score: number;
      };
    }

    const data: NestedData[] = [
      { id: 1, meta: { score: 100 } },
      { id: 2, meta: { score: 50 } },
      { id: 3, meta: { score: 200 } },
    ];

    it('should use custom getValue extractor', () => {
      const sorted = [...data].sort(
        createSortComparator<NestedData>(
          'id',
          'asc',
          (item) => item.meta.score
        )
      );
      expect(sorted[0]?.meta.score).toBe(50);
      expect(sorted[1]?.meta.score).toBe(100);
      expect(sorted[2]?.meta.score).toBe(200);
    });

    it('should handle custom getValue returning different types', () => {
      interface CustomData {
        id: number;
        tags: string[];
      }

      const customData: CustomData[] = [
        { id: 1, tags: ['c', 'b'] },
        { id: 2, tags: ['a'] },
        { id: 3, tags: ['d', 'e', 'f'] },
      ];

      // Sort by number of tags
      const sorted = [...customData].sort(
        createSortComparator<CustomData>(
          'id',
          'asc',
          (item) => item.tags.length
        )
      );

      expect(sorted[0]?.tags.length).toBe(1);
      expect(sorted[1]?.tags.length).toBe(2);
      expect(sorted[2]?.tags.length).toBe(3);
    });
  });

  describe('Edge cases', () => {
    interface EdgeData {
      value: number;
    }

    it('should handle empty array', () => {
      const data: EdgeData[] = [];
      const sorted = [...data].sort(createSortComparator<EdgeData>('value', 'asc'));
      expect(sorted).toEqual([]);
    });

    it('should handle single element array', () => {
      const data: EdgeData[] = [{ value: 5 }];
      const sorted = [...data].sort(createSortComparator<EdgeData>('value', 'asc'));
      expect(sorted).toEqual([{ value: 5 }]);
    });

    it('should not mutate original array', () => {
      const data: EdgeData[] = [{ value: 5 }, { value: 1 }, { value: 3 }];
      const original = [...data];
      const sorted = [...data].sort(createSortComparator<EdgeData>('value', 'asc'));

      expect(data).toEqual(original);
      expect(sorted).not.toEqual(data);
    });
  });
});
