import React, { useEffect } from 'react';
import { Switch, NavLink, Route } from 'react-router-dom';
import Page from '../components/Page';
import { activeNavCSS, navLinkCSSSettings, activeNavCSSSettingsPage } from '../helpers/CSSHelpers';

function SettingsPage() {
  return (
    <Page title='Settings'>
      <div className='flex'>
        <div style={{width: 200 +'rem'}} className='max-w-xs border-r-2 pr-2'>
          <ul className='grid grid-cols-1 mb-4'>
            <NavLink exact to='/settings' activeStyle={activeNavCSSSettingsPage} className={navLinkCSSSettings}>
              Edit Profile Info
            </NavLink>

            <NavLink to='/settings/change-password' activeStyle={activeNavCSSSettingsPage} className={navLinkCSSSettings}>
              Change Your Password
            </NavLink>
          </ul>
        </div>

        <div className=''>
          <Switch>
            <Route exact path='/settings'>
              <p>Edit profile page Edit profile pageEdit profile pageEdit profile pageEdit profile pageEdit profile pageEdit profile pageEdit profile pageEdit profile page</p>
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
