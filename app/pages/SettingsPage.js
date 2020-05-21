import React, { useEffect } from 'react';
import { Switch, NavLink, Route } from 'react-router-dom';
import Page from '../components/Page';
import { activeNavCSS, navLinkCSSSettings, activeNavCSSSettingsPage } from '../helpers/CSSHelpers';

function SettingsPage() {
  return (
    <Page title='Settings' wide={true}>
      <div className='grid grid-cols-2'>
        <div className='max-w-xs border-r'>
          <ul className='grid grid-cols-1 mb-4'>
            <NavLink exact to='/settings/edit-profile' activeStyle={activeNavCSSSettingsPage} className={navLinkCSSSettings}>
              Edit Profile Info
            </NavLink>

            <NavLink to='/settings/change-password' activeStyle={activeNavCSSSettingsPage} className={navLinkCSSSettings}>
              Change Your Password
            </NavLink>
          </ul>
        </div>

        <div>
          <Switch>
            <Route path='/settings/edit-profile'>
              <p>Edit profile page</p>
            </Route>
            <Route path='/settings/change-password'>
              <p>Change password page</p>
            </Route>
          </Switch>
        </div>
      </div>
    </Page>
  );
}

export default SettingsPage;
