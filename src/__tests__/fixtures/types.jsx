import T from 'typecheck-decorator';

function propType(schema) {
  return T.toPropType(T.Array(T.shape([
    T.option(T.oneOf(T.exactly(null), T.Error())), // err
    T.option(schema), // res
  ])));
}

const schemas = {
  user: T.shape({
    userId: T.String(),
    userName: T.String(),
    profilePicture: T.String(),
  }),
};

export { T, propType, schemas };
