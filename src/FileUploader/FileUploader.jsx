import React from 'react';
import PropTypes from 'prop-types';
import addClass from 'dom-helpers/class/addClass';
import UAParser from 'ua-parser-js';
import isFunction from 'lodash/isFunction';
import mimoza from 'mimoza';

import Input from '../Input';
import service from '../utils/service';
import Alert from '../Alert/Alert';

import style from './style/index.scss';

const propTypes = {
  uploadUrl: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  onChange: PropTypes.func,
  children: PropTypes.node,
};

const defaultProps = {
  value: null,
  onChange: () => {},
  children: null,
};

const uaParser = new UAParser(navigator.userAgent);

class FileUploader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };

    this.isIE = uaParser.getBrowser().name === 'IE';
    this.onChange = this.onChange.bind(this);
    this.upload = this.upload.bind(this);
    this.onFrameLoad = this.onFrameLoad.bind(this);
  }

  componentWillUnmount() {
    if (this.clearFrameTimer != null) {
      clearTimeout(this.clearFrameTimer);
    }

    this.clearFrame();
  }

  onFrameLoad() {
    try {
      const { frame } = this;

      if (frame != null) {
        const content = frame.contentWindow
          ? frame.contentWindow.document.body
          : frame.contentDocument.document.body;

        const { data: { url } } = JSON.parse(content.innerHTML || 'null innerHTML');

        this.props.onChange(url);
      }
    } catch (e) {
      this.setState({ error: JSON.stringify(e) });
    } finally {
      this.clearFrame();
    }
  }

  onChange(file) {
    let value;

    if (typeof file === 'string') {
      // IE 9
      value = {
        name: file,
        type: mimoza.getMimeType(file),
      };
    } else {
      value = file;
    }

    this.props.onChange(value);
  }

  upload() {
    if (this.isIE) {
      this.uploadIE();
    } else {
      this.uploadHtml5();
    }
  }

  async uploadHtml5() {
    try {
      const { url } = await service.postFile(
        this.props.uploadUrl,
        this.props.value,
      );
      this.props.onChange(url);
    } catch (e) {
      this.setState({ error: JSON.stringify(e) });
    }
  }

  uploadIE() {
    const frame = document.createElement('iframe');

    frame.setAttribute('name', 'file-upload-iframe');
    frame.setAttribute('id', 'file-upload-iframe');
    addClass(frame, 'hidden');

    document.body.appendChild(frame);

    this.frame = frame;

    frame.addEventListener('load', this.onFrameLoad);

    this.form.submit();

    this.clearFrameTimer = setTimeout(() => {
      this.clearFrameTimer = null;
      this.clearFrame();
    }, 5000);
  }

  clearFrame() {
    if (this.frame != null) {
      this.frame.removeEventListener('load', this.onFrameLoad);
      this.frame.parentNode.removeChild(this.frame);
      this.frame = null;
    }
  }

  renderInput() {
    if (this.isIE) {
      return (
        <form
          ref={(el) => { this.form = el; }}
          target="file-upload-iframe"
          method="POST"
          encType="multipart/form-data"
          action={this.props.uploadUrl}
          className={style['file-input']}
        >
          <Input
            type="file"
            onChange={this.onChange}
            name="file"
            className={style['file-input']}
          />
        </form>
      );
    }

    return (
      <Input
        className={style['file-input']}
        type="file"
        onChange={this.onChange}
        name="file"
      />
    );
  }

  render() {
    const child = React.Children.only(this.props.children);

    return (
      <div>
        <div className="p-relative cursor-pointer d-inline-block">
          {this.renderInput()}

          {child != null && React.cloneElement(child, {
            ...child.props,
            ref: (el) => {
              if (isFunction(child.props.ref)) {
                child.props.ref(el);
              }

              this.fake = el;
            },
          })}
        </div>

        <Alert
          visible={this.state.error != null}
          onClose={() => this.setState({ error: null })}
        >
          {this.state.error}
        </Alert>
      </div>
    );
  }
}

FileUploader.propTypes = propTypes;
FileUploader.defaultProps = defaultProps;

export default FileUploader;
