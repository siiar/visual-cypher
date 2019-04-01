import * as React from 'react';
import { Provider } from 'react-redux';
import {Store} from "./Store";
import Main from "./Main";
import './App.css';

interface IProps {
};
interface IState {
};
class App extends React.Component<IProps,IState> {
  constructor(props: IProps){
    super(props);
    
  }
  public render() {
    return (
      <Provider store={Store}>
        <Main/>
      </Provider>
    );
  }
}

export default App;
