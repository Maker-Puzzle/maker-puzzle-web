import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from '../css/components/top-title';
import ProfileImage from '../components/FlexibleImage';

const cx = classNames.bind(styles);

const TitleSection = ({ title, thumbnailURL, props, maker }) => {

  const url = thumbnailURL? thumbnailURL : "/images/default_profile.jpg";

  return (
    <Link to={`/maker/${maker.profile.userid}/`}>
    <div className={cx('main-section')}>
        <span className={cx('profile-image')}>
            <ProfileImage src={url} x={40} y={40} />
        </span>
          <label className={cx('title')}>
            {title}
          </label>
    </div>
    </Link>
  );
};

TitleSection.propTypes = {
  title: PropTypes.string.isRequired,
  thumbnailURL: PropTypes.string
};

function mapStateToProps(state) {
  return {
    user: state.user,
    maker: state.maker.maker
  };
}

export default connect(mapStateToProps)(TitleSection);
