import React from 'react';
import { Switch, NavLink, Route } from 'react-router-dom';
import { navLinkCSS, activeNavCSS } from '../../helpers/CSSHelpers';
import EditUserProfileInfo from '../../components/profile/EditUserProfileInfo';
import ChangePassword from '../../components/auth/ChangePassword';
import DeleteAccount from '../../components/profile/DeleteAccount';
import Page from '../../components/shared/Page';

function SettingsPage() {
  return (
    <>
      <div className='w-full shadow border-b border-gray-500 bg-white pt-6'>
        <ul className='flex justify-center mx-auto'>
          <NavLink exact to='/settings' activeStyle={activeNavCSS} className={navLinkCSS}>
            Edit Profile Info
          </NavLink>

          <NavLink to='/settings/change-password' activeStyle={activeNavCSS} className={navLinkCSS}>
            Change Your Password
          </NavLink>

          <NavLink to='/settings/delete-account' activeStyle={activeNavCSS} className={navLinkCSS}>
            Delete Account
          </NavLink>
        </ul>
      </div>

      <Page margin='mx-2' title='Settings'>
        <Switch>
          <Route exact path='/settings'>
            <EditUserProfileInfo />
          </Route>
          <Route path='/settings/change-password'>
            <ChangePassword />
          </Route>
          <Route path='/settings/delete-account'>
            <DeleteAccount />
          </Route>
        </Switch>
      </Page>
    </>
  );
}

export default SettingsPage;
