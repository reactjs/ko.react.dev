function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      // highlight-next-line
      const {forwardedRef, ...rest} = this.props;

      // 사용자 정의 prop "forwardedRef"를 ref로 할당합니다.
      // highlight-next-line
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // React.forwardRef에서 제공하는 두 번째 파라미터 "ref"에 주의해주세요.
  // 가령 "forwardedRef"같은 일반 prop으로 LogProps에 전달할 수 있습니다.
  // 그 다음 Component에 연결할 수 있습니다.
  // highlight-range{1-3}
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
