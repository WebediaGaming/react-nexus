import T from 'typecheck-decorator';

export const version = T.shape([
  T.nullable(T.Object()),
  T.any(),
  T.option(T.Number()),
]);

export const versions = T.Array({ type: version });
