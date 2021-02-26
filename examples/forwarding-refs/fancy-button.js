class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// FancyButton을 내보내는 대신 LogProps를 내보냅니다.
// 그래도 FancyButton을 렌더링합니다.
// highlight-next-line
export default logProps(FancyButton);
