import React from 'react';
import { Switch, NavLink, Route } from 'react-router-dom';
import Page from '../components/Page';
import { navLinkCSS, activeNavCSS, navLinkCSSSettings, activeNavCSSSettingsPage } from '../helpers/CSSHelpers';
import EditUserProfileInfo from '../components/EditUserProfileInfo';
import ChangePassword from '../components/ChangePassword';

function SettingsPage() {
  return (
    <Page margin='mx-2' title='Settings'>
      <ul className='flex border-b'>
        <NavLink exact to='/settings' activeStyle={activeNavCSS} className={navLinkCSS}>
          Edit Profile Info
        </NavLink>

        <NavLink to='/settings/change-password' activeStyle={activeNavCSS} className={navLinkCSS}>
          Change Your Password
        </NavLink>
      </ul>

      <div className=''>
        <Switch>
          <Route exact path='/settings'>
            <EditUserProfileInfo />
          </Route>
          <Route path='/settings/change-password'>
            <ChangePassword/>
          </Route>
        </Switch>
      </div>
    </Page>
  );
}

export default SettingsPage;
