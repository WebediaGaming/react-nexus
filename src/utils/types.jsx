import T from 'typecheck-decorator';

export const version = T.shape([
  T.option(T.oneOf(T.instanceOf(Error), T.String())),
  T.any(),
  T.option(T.oneOf(T.instanceOf(Date), T.String())),
]);

export const versions = T.Array({ type: version });
