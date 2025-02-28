type SelectionPosition = {
  line: number;
  char: number;
};

type Selection = {
  start: SelectionPosition;
  end: SelectionPosition;
} | null;

export type { SelectionPosition, Selection };
