import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import Clickable from '../Clickable';

import './style.scss';

class Pagination extends React.PureComponent {
  static propTypes = {
    total: PropTypes.number,
    page: PropTypes.number,
    totalPages: PropTypes.number,
    rowsPerPage: PropTypes.number,
    onChange: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    total: null,
    page: 1,
    totalPages: null,
    rowsPerPage: null,
    onChange: () => {},
    className: null,
  };

  getItem(page) {
    return (
      <span
        className={classNames(
          'page-item',
          { current: page === this.props.page },
        )}
        aria-hidden
        key={page}
        onClick={() => {
          if (page !== this.props.page) {
            this.props.onChange(page);
          }
        }}
      >
        {page}
      </span>
    );
  }

  render() {
    let { totalPages } = this.props;

    if (totalPages != null) {
      if (totalPages === 1) {
        return null;
      }
    } else if (this.props.rowsPerPage != null && this.props.total < this.props.rowsPerPage) {
      return null;
    }

    const isFirstPage = this.props.page === 1;

    if (totalPages == null) {
      totalPages = Math.ceil(this.props.total / this.props.rowsPerPage);
    }

    const isLastPage = (this.props.page === totalPages);

    return (
      <div
        className={classNames(
          'pagination justify-content-end',
          { [this.props.className]: !!this.props.className },
        )}
      >
        <Clickable
          onClick={() => {
            if (!isFirstPage) {
              this.props.onChange(this.props.page - 1);
            }
          }}
        >
          <div
            className={classNames(
              'page-item',
              { disabled: isFirstPage },
            )}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>
        </Clickable>

        <span>
          {(() => {
            const pageItems = [];

            if (totalPages < 10) {
              for (let i = 1; i <= totalPages; i += 1) {
                pageItems.push(this.getItem(i));
              }

              return pageItems;
            }

            if (this.props.page < 4) {
              for (let i = 1; i <= 5; i += 1) {
                pageItems.push(this.getItem(i));
              }

              pageItems.push(<span className="ellipsis" key="ellipsis"> ... </span>);
              pageItems.push(this.getItem(totalPages));

              return pageItems;
            }

            if (this.props.page > totalPages - 4) {
              pageItems.push(this.getItem(1));
              pageItems.push(<span className="ellipsis" key="ellipsis"> ... </span>);

              for (let i = totalPages - 4; i <= totalPages; i += 1) {
                pageItems.push(this.getItem(i));
              }

              return pageItems;
            }

            pageItems.push(this.getItem(1));
            pageItems.push(<span className="ellipsis" key="ellipsis1"> ... </span>);

            for (let i = this.props.page - 2; i <= this.props.page + 2; i += 1) {
              pageItems.push(this.getItem(i));
            }

            pageItems.push(<span className="ellipsis" key="ellipsis2"> ... </span>);
            pageItems.push(this.getItem(totalPages));

            return pageItems;
          })()}
        </span>

        <Clickable
          onClick={() => {
            if (!isLastPage) {
              this.props.onChange(this.props.page + 1);
            }
          }}
        >
          <div
            className={classNames(
              'page-item',
              { disabled: isLastPage },
            )}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        </Clickable>
      </div>
    );
  }
}

export default Pagination;
