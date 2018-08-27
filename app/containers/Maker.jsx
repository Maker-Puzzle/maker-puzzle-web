import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import ImageUploader from '../components/ImageUploader';
import TopTitle from '../components/TopTitle';
import ContentsSection from '../components/ContentsSection';
import SingleLine from '../components/SingleLine';
import styles from '../css/components/maker';

import { Maker } from '../utils/objects';

const cx = classNames.bind(styles);

class Container extends Component {
  render() {
    const { maker: data, user } = this.props;
    const maker = new Maker(data);
    const isOwnPage = user && maker && (maker.userid === user.userid);
    return (
      <div className={cx('main-section')}>
        <SingleLine width={'100%'} color={'#dddddd'} thickness={2} />
        <TopTitle 
          title={maker.getName()}
          to={maker.getHomeLink()}
          thumbnailURL={maker.picture? maker.getProfileImage():null} 
        />
        <SingleLine width={'100%'} color={'#dddddd'} thickness={2} />
        <ContentsSection owner={maker} contentsType="maker" isOwnPage={isOwnPage} />
        <SingleLine width={'100%'} color={'#dddddd'} thickness={2} />
      </div>
    );
  }
}

Container.propTypes = {
  maker: PropTypes.object
};

function mapStateToProps(state) {
  return {
    maker: state.maker.maker,
    user: state.user.account
  };
}

export default connect(mapStateToProps, {})(Container);
