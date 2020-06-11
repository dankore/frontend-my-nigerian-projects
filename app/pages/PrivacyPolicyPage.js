import React from 'react';
import Page from '../components/Page';
import { Link } from 'react-router-dom';

function PrivacyPolicyPage() {
  return (
    <Page margin='mx-2' title='Terms'>
      <h1 className='text-center text-2xl text-semibold font-mono'>Privacy Policy</h1>
      <div className='relative z-10 leading-normal w-full max-w-md bg-white p-4 md:p-8 mx-auto shadow-md'>
        <p>
          The Bidding App("us", "we", or "our") operates the
          <Link className='text-blue-dark' to=' https://bidding.netlify.app '>
            {' '}
            https://bidding.netlify.app
          </Link>
          website and the COMING SOON mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>
        <p className='mt-4'>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.</p>
        <h3 className='mt-8 mb-4'>Information Collection And Use</h3>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
        <h3 className='mt-8 mb-4'>Types of Data Collected</h3>
        <h4 className='mb-4'>Personal Data</h4>
        <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you("Personal Data").</p>
        <p className='mt-2'>Personally identifiable information may include, but is not limited to:</p>
        <ul>
          <li className='mt-2'>Email address</li>
          <li className='mt-2'>First name and last name</li>
          <li className='mt-2'>Phone number</li>
          <li className='mt-2'>Address, State, Province, ZIP / Postal code, City</li>
          <li className='mt-2'>Cookies and Usage Data</li>
          <li className='mt-2'>Usage Data</li>
        </ul>
        <p className='mt-2'>We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device("Usage Data"). This Usage Data may include information such as your computer 's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
        <p className='mt-2'>When you access the Service by or through a mobile device, this Usage Data may include information such as the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device identifiers and other diagnostic data.</p>
        <h3 className='mt-8 mb-4'>Tracking &amp; Cookies Data</h3>
        <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.</p>
        <p className='mt-2'>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
        <h4 className='mt-4 mb-2'>Examples of Cookies we use:</h4>
        <ul>
          <li className='mt-2'>Session Cookies: We use Session Cookies to operate our Service.</li>
          <li className='mt-2'>Analytics Cookies: We use tracking/analytic cookies to monitor page views, unique visitors, and session length. No personal information is included, and the data never leaves our service.</li>
          <li className='mt-2'>Security Cookies: We use Security Cookies for security purposes.</li>
        </ul>
        <p className='mt-4'>
          Please refer to our{' '}
          <Link className='text-blue-dark underline' to='/cookies'>
            Cookie Policy page
          </Link>{' '}
          for more info.
        </p>
        <h3 className='mt-8 mb-4'>Use of Data</h3>
        <p>The Bidding App uses the collected data for various purposes:</p>
        <ul>
          <li className='mt-3'>To provide and maintain the Service</li>
          <li className='mt-3'>To notify you about changes to our Service</li>
          <li className='mt-3'>To allow you to participate in interactive features of our Service when you choose to do so</li>
          <li className='mt-3'>To provide customer care and support</li>
          <li className='mt-3'>To provide analysis or valuable information so that we can improve the Service</li>
          <li className='mt-3'>To monitor the usage of the Service</li>
          <li className='mt-3'>To detect, prevent and address technical issues</li>
        </ul>
        <h3 className='mt-8 mb-4'>Transfer Of Data</h3>
        <p>Your information, including Personal Data, may be transferred to— and maintained on— computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.</p>
        <p className='mt-2'>If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
        <p className='mt-2'>The Bidding App will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.</p>
        <h3 className='mt-8 mb-4'>Disclosure Of Data</h3>
        <h4 className='mb-4'>Legal Requirements</h4>
        <p>The Bidding App may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
        <ul>
          <li className='mt-2'>To comply with a legal obligation</li>
          <li className='mt-2'>To protect and defend the rights or property of The Bidding App</li>
          <li className='mt-2'>To prevent or investigate possible wrongdoing in connection with the Service</li>
          <li className='mt-2'>To protect the personal safety of users of the Service or the public</li>
          <li className='mt-2'>To protect against legal liability</li>
        </ul>
        <h3 className='mt-8 mb-4'>Security Of Data</h3>
        <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
        <h3 className='mt-8 mb-4'>Service Providers</h3>
        <p>We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service - related services or to assist us in analyzing how our Service is used.</p>
        <p>These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
        <h3 className='mt-8 mb-4'>Links To Other Sites</h3>
        <p>Our Service may contain links to other sites that are not operated by us. If you click on a third - party link, you will be directed to that third party 's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third - party sites or services.</p>
        <h3 className='mt-8 mb-4'>Children's Privacy</h3>
        <p>Our Service does not address anyone under the age of 18("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>
        <h3 className='mt-8 mb-4'>Changes To This Privacy Policy</h3>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and / or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.</p>
        <p className='mt-2'>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        <h3 className='mt-8 mb-4'>Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us at
          <Link className='text-blue-dark' to='mailto:adamu.dankore@gmail.com'>
            {' '}
            adamu.dankore@gmail.com.
          </Link>
        </p>
      </div>
    </Page>
  );
}

export default PrivacyPolicyPage;
