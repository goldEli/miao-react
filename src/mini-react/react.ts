import { commitRender } from './fiber';

export class Component {
  props: any;
  state: any;
  constructor(props) {
    this.props = props;
  }
}

// @ts-ignore
Component.prototype.isReactComponent = true;

// @ts-ignore
Component.prototype.setState = function (newState) {
  this.state = {
    ...this.state,
    ...newState,
  };
  commitRender();
};

// @ts-ignore
Component.prototype._UpdateProps = function (props) {
  this.props = props;
};
