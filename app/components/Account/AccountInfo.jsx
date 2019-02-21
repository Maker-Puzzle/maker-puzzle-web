import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

const Component = ({ user, items, selected, onClick, cx }) => {

  return (
    <div className={cx('info-main')}>
      <div className={cx('info-title')}>
        계정 기본정보
      </div>

      <div className={cx('info-form-1')}>
        <label className={cx('info-title')}>
          이메일주소
        </label>
        <input type="text" value={user.email} />
      </div>

      <div className={cx('info-form-1')}>
        <label className={cx('info-title')}>
          이름
        </label>
        <input type="text" value={user.name} />
      </div>

      <div className={cx('info-form-1')}>
        <label className={cx('info-title')}>
          비밀번호
        </label>
        <input type="button" />
      </div>

      <div className={cx('info-form-1')}>
        <label className={cx('info-title')}>
          성별
        </label>
        <input type="radio" /> 남자 <input type="radio" /> 여자
      </div>

      <div className={cx('info-form-1')}>
        <label className={cx('info-title')}>
          출생연도
        </label>
        <input type="list" value={user.birthYear} />
      </div>

      <div className={cx('info-form-1')}>
        <label className={cx('info-title')}>
          로그인 계정 연결
        </label>
        <input type="button" value="facebook" />
        <input type="button" value="google" />
      </div>

      <div className={cx('info-form-1')}>
        <input type="checkbox" />
        <label className={cx('info-title')}>
          메이커퍼즐에서 진행하는 이벤트, 프로모션에 대한 광고를 수신하겠습니다.
        </label>
      </div>
      
    </div>
  );
};

Component.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Component;


