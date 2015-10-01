import T from 'typecheck-decorator';

export const version = T.shape([
  T.nullable(T.oneOf(T.instanceOf(Error), T.String())),
  T.any(),
  T.option(T.Number()),
]);

export const versions = T.Array({ type: version });
