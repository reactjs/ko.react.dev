// createContext에 보내는 기본값의 모양을
// 하위 컴포넌트가 받고 있는 매개변수 모양과 동일하게 만드는 것 잊지마세요!
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
