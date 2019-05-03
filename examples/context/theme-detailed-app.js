import {ThemeContext, themes} from './theme-context';
import ThemedButton from './themed-button';

// ThemedButton를 사용하는 중간에 있는 컴포넌트
function Toolbar(props) {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.light,
    };

    this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };
  }

  render() {
    //highlight-range{1-2}
    // ThemeProvider 안에 있는 ThemedButton은 state로부터 theme 값을 읽지만
    // Provider 밖에 있는 ThemedButton는 기본값인 dark를 사용합니다.
    //highlight-range{3-5,7}
    return (
      <Page>
        <ThemeContext.Provider value={this.state.theme}>
          <Toolbar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <Section>
          <ThemedButton />
        </Section>
      </Page>
    );
  }
}

ReactDOM.render(<App />, document.root);
