import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';

import Modal from '../Modal';

import './style/index.scss';
import Clickable from '../Clickable';

const propTypes = {
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  hasCloseButton: PropTypes.bool,
  title: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

const defaultProps = {
  onClose: () => {},
  onConfirm: () => {},
  confirmText: '确定',
  cancelText: '取消',
  hasCloseButton: true,
  visible: false,
  title: null,
  children: null,
};

class Confirm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentWillReceiveProps({ visible }) {
    if (visible && !this.props.visible) {
      document.addEventListener('keydown', this.onKeyPress);
    } else if (!visible && this.props.visible) {
      document.removeEventListener('keydown', this.onKeyPress);
    }
  }

  onKeyPress(e) {
    e.preventDefault();

    const code = keycode(e);

    if (code === 'enter') {
      this.props.onConfirm();
    } else if (code === 'esc') {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Modal
        {...this.props}
        className="confirm"
        title="提示"
      >
        <div className="dialog-content">
          {this.props.children}
        </div>

        <div className="dialog-actions">
          <Clickable
            onClick={this.props.onConfirm}
          >
            <div className="btn btn-primary">
              {this.props.confirmText}
            </div>
          </Clickable>

          <Clickable
            onClick={this.props.onClose}
          >
            <div className="btn btn-default">
              {this.props.cancelText}
            </div>
          </Clickable>
        </div>
      </Modal>
    );
  }
}

Confirm.propTypes = propTypes;
Confirm.defaultProps = defaultProps;

export default Confirm;
