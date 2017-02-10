export interface StringIndexed<T> {
  [index: string]: T,
}

export interface NumericIDed {
  $id: number,
}
