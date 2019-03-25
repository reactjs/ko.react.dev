class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // Toolbar 컴포넌트는  ThemedButton에게 보내주기 위해
  // 불필요한 테마 prop를 받고 있습니다.
  // 앱 안의 모든 버튼이 테마를 알아야 한다면
  // 이 정보를 일일히 넘기는 과정은 매우 곤혹스러울 수 있습니다.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
