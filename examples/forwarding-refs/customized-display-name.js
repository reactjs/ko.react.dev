function logProps(Component) {
  class LogProps extends React.Component {
    // ...
  }

  function forwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  // DevTools에서 이 컴포넌트에 조금 더 유용한 표시 이름을 지정하세요.
  // 예, "ForwardRef(logProps(MyComponent))"
  // highlight-range{1-2}
  const name = Component.displayName || Component.name;
  forwardRef.displayName = `logProps(${name})`;

  return React.forwardRef(forwardRef);
}
