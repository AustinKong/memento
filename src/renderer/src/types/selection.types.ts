type SelectionPosition = {
  line: number;
  char: number;
  absChar: number;
};

type Selection = {
  start: SelectionPosition;
  end: SelectionPosition;
} | null;

export type { SelectionPosition, Selection };
