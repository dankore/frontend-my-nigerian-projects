import React, { useEffect, useContext } from 'react';
import Page from '../../components/shared/Page';
import { useImmerReducer } from 'use-immer';
import { useParams, withRouter, Link } from 'react-router-dom';
import Axios from 'axios';
import NotFoundPage from '../shared/NotFoundPage';
import { CSSTransition } from 'react-transition-group';
import StateContext from '../../StateContext';
import { inputTextAreaCSSCreateBid, inputTextAreaCSS, CSSTransitionStyle } from '../../helpers/CSSHelpers';
import DispatchContext from '../../DispatchContext';
import { handleUploadImage } from '../../helpers/JSHelpers';

function CreateBid(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    project: {
      title: '',
      bidSubmissionDeadline: '',
    },
    item: { name: '', quantity: 0, price_per_item: 0 },
    whatBestDescribesYou: {
      value: '',
      hasErrors: false,
      message: '',
    },
    yearsOfExperience: {
      value: -1,
      hasErrors: false,
      message: '',
    },
    otherDetails: {
      value: '',
      hasErrors: false,
      message: '',
    },
    phone: {
      value: '',
      hasErrors: false,
      message: '',
    },
    email: {
      value: '',
      hasErrors: false,
      message: '',
    },
    image: {
      value: '',
      hasErrors: false,
      message: '',
    },
    items: [],
    itemTotal: 0,
    notFound: false,
    projectId: useParams().id,
    isOpen: false,
    sendCount: 0,
    isSaving: false,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'fetchingProjectComplete':
        draft.project.title = action.value.title;
        draft.project.bidSubmissionDeadline = action.value.bidSubmissionDeadline;
        return;
      case 'addItem':
        if (draft.item.name != '' && draft.item.quantity != '' && draft.item.price_per_item != '') {
          draft.items.push(action.value);
          draft.itemTotal += +action.value.quantity * +action.value.price_per_item;
        }
        return;
      case 'notFound':
        draft.notFound = true;
        return;
      case 'whatBestDescribesYou':
        draft.whatBestDescribesYou.hasErrors = false;
        draft.whatBestDescribesYou.value = action.value;
        return;
      case 'whatBestDescribesYouRules':
        if (draft.whatBestDescribesYou.value == '') {
          draft.whatBestDescribesYou.hasErrors = true;
          draft.whatBestDescribesYou.message = 'Please choose from the options.';
        }
        return;
      case 'yearsExperienceUpdate':
        draft.yearsOfExperience.hasErrors = false;
        draft.yearsOfExperience.value = action.value;
        return;
      case 'yearsExperienceUpdateRules':
        if (draft.yearsOfExperience.value < 0) {
          draft.yearsOfExperience.hasErrors = true;
          draft.yearsOfExperience.message = 'Years of experience required.';
        }
        if (draft.yearsOfExperience.value > 100) {
          draft.yearsOfExperience.hasErrors = true;
          draft.yearsOfExperience.message = 'Years of experience cannot exceed 100 years.';
        }
        return;
      case 'itemNameUpdate':
        if (action.value.length > 50) {
          draft.item.name = 'Item name cannot exceed 50 characters. Please delete this entry.';
        } else {
          draft.item.name = action.value;
        }
        return;
      case 'quantityUpdate':
        if (action.value > Number.MAX_SAFE_INTEGER) {
          draft.item.quantity = 'Quantity name cannot exceed 9007199254740991. Please delete this entry.';
        } else {
          draft.item.quantity = action.value;
        }
        return;
      case 'pricePerItemUpdate':
        if (action.value > Number.MAX_SAFE_INTEGER) {
          draft.item.price_per_item = 'Price per item name cannot exceed 9007199254740991. Please delete this entry.';
        } else {
          draft.item.price_per_item = action.value;
        }
        return;
      case 'totalUpdate':
        draft.itemTotal = action.value;
        draft.itemTotal += +action.value.quantity * +action.value.price_per_item;
        return;
      case 'otherDetails':
        draft.otherDetails.value = action.value;
        return;
      case 'deleteItem':
        draft.items.splice(action.value.index, 1);
        draft.itemTotal -= +action.value.quantity * +action.value.price_per_item;
        return;
      case 'phoneUpdate':
        draft.phone.hasErrors = false;
        draft.phone.value = action.value;
        return;
      case 'phoneRules':
        if (!action.value.trim()) {
          draft.phone.hasErrors = true;
          draft.phone.message = 'Phone cannot be empty';
        }
        if (/[^\d\+-]/.test(action.value.trim())) {
          draft.phone.hasErrors = true;
          draft.phone.message = 'Phone must be numbers, + and -.';
        }
        if (action.value.length > 30) {
          draft.phone.hasErrors = true;
          draft.phone.message = 'Phone cannot exceed 30 characters.';
        }
        return;
      case 'emailUpdate':
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        return;
      case 'emailRules':
        if (!action.value.trim()) {
          draft.email.hasErrors = true;
          draft.email.message = 'Email cannot be empty';
        }
        if (action.value.length > 100) {
          draft.email.hasErrors = true;
          draft.email.message = 'Email cannot exceed 100 characters.';
        }
        return;
      case 'emailAfterDelay':
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = 'Please provide a valid email.';
        }
        return;
      case 'imageUpdate':
        draft.image.hasErrors = false;
        draft.image.value = action.value;
        return;
      case 'toggleOptions':
        draft.isOpen = !draft.isOpen;
        return;
      case 'isSavingStarted':
        draft.isSaving = true;
        return;
      case 'isSavingEnds':
        draft.isSaving = false;
        return;
      case 'submitForm':
        if (!draft.whatBestDescribesYou.hasErrors && draft.whatBestDescribesYou.value != '' && !draft.yearsOfExperience.hasErrors && draft.yearsOfExperience.value != '' && !draft.phone.hasErrors && draft.phone.value != '' && !draft.email.hasErrors && draft.email.value != '') {
          draft.sendCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    const projectId = state.projectId;

    (async function fetchProjectForCreateBid() {
      try {
        const response = await Axios.get(`/project/${projectId}`, { cancelToken: request.token });
        if (response.data) {
          dispatch({ type: 'fetchingProjectComplete', value: response.data });
        } else {
          dispatch({ type: 'notFound' });
        }
      } catch (error) {
        console.log('Problem getting project details. CreateBid.js file.');
      }
    })();

    return () => request.cancel();
  }, []);

  // DELAY: EMAIL
  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: 'emailAfterDelay' }), 800);

      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  // SAVE BID
  useEffect(() => {
    const request = Axios.CancelToken.source();
    if (state.sendCount) {
      dispatch({ type: 'isSavingStarted' });
      (async function saveBid() {
        try {
          // SAVE IMAGE TO CLOUDINARY AND GET URL
          let image_url = '';
          if (state.image.value) {
            image_url = await handleUploadImage(state.image.value, 'bid');
          }
          const response = await Axios.post(
            '/create-bid',
            {
              projectId: state.projectId,
              whatBestDescribesYou: state.whatBestDescribesYou.value,
              yearsOfExperience: state.yearsOfExperience.value,
              items: state.items,
              otherDetails: state.otherDetails.value,
              phone: state.phone.value,
              email: state.email.value,
              image: image_url,
              userCreationDate: appState.user.userCreationDate,
              token: appState.user.token,
            },
            { cancelToken: request.token }
          );

          dispatch({ type: 'isSavingEnds' });

          if (response.data.status == 'Success') {
            props.history.push(`/${state.projectId}/bid/${response.data.bidId}`);
            appDispatch({ type: 'flashMessage', value: 'Bid successfully added.' });
          } else {
            appDispatch({ type: 'flashMessageError', value: 'Adding bid failed. Please try again.' });
          }
        } catch (error) {
          console.log({ errorCreatingBid: error });
        }
      })();
    }
    return () => request.cancel();
  }, [state.sendCount]);

  function handleAddItem() {
    dispatch({ type: 'addItem', value: state.item });
  }

  if (state.notFound) {
    return <NotFoundPage />;
  }

  function handleDeleteItem(e) {
    const itemToDelete = {
      index: e.target.id,
      quantity: e.target.getAttribute('data-quantity'),
      price_per_item: e.target.getAttribute('data-price_per_item'),
    };

    dispatch({ type: 'deleteItem', value: itemToDelete });
  }

  function handleSubmitBid(e) {
    e.preventDefault();
    dispatch({ type: 'whatBestDescribesYouRules', value: state.whatBestDescribesYou.value });
    dispatch({ type: 'yearsExperienceUpdateRules', value: state.yearsOfExperience.value });
    dispatch({ type: 'phoneRules', value: state.phone.value });
    dispatch({ type: 'emailRules', value: state.email.value });
    dispatch({ type: 'emailAfterDelay', value: state.email.value });
    dispatch({ type: 'submitForm' });
  }

  const itemHtmlTemplate = function (item, index) {
    return (
      <div key={index} className='flex p-2 border border-gray-200 justify-between'>
        <p style={{ maxWidth: 200 + 'px', overflowWrap: 'break-word', minWidth: 0 + 'px' }} className='mr-2'>
          {item.name}
        </p>
        <p className='mr-2'>{item.quantity}</p>
        <p className='mr-2'>{item.price_per_item}</p>
        <p className='mr-2'>{new Intl.NumberFormat().format(+(item.quantity * item.price_per_item))}</p>
        <div data-quantity={`${item.quantity}`} data-price_per_item={`${item.price_per_item}`} id={`${index}`} onClick={handleDeleteItem} className='text-red-600 cursor-pointer'>
          X
        </div>
      </div>
    );
  };

  const addItemButtonBool = state.item.name == '' && state.item.quantity == 0 && state.item.price_per_item == 0;

  return (
    <Page margin='mx-2' wide={true} title='Create Bid'>
      <div className='-mt-6'>
        <div className='flex justify-center text-blue-600'>
          <svg className='w-12' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <line x1='12' y1='5' x2='12' y2='19'></line>
            <line x1='5' y1='12' x2='19' y2='12'></line>
          </svg>
        </div>
        <p className='text-xl font-semibold text-center leading-tight'>Create New Bid For:</p>
        <h2 className='text-center px-2 mb-8 text-2xl leading-8 font-semibold tracking-tight font-display text-gray-900 sm:text-3xl sm:leading-9'>
          <Link to={`/project/${state.projectId}`} className='underline hover:text-blue-600'>
            {state.project.title}
          </Link>
        </h2>
        <form onSubmit={handleSubmitBid}>
          <div className='border border-gray-200 bg-white p-3 shadow lg:rounded-lg'>
            {/* WHAT BEST DESCRIBES YOU */}
            <div className='mb-4'>
              <label className='w-full text-xs font-bold uppercase tracking-wide text-gray-700 mr-3' htmlFor='as-what'>
                What best describes you? <span className='text-red-600'>*</span>
              </label>
              <span className='relative inline-block'>
                <select onChange={e => dispatch({ type: 'whatBestDescribesYou', value: e.target.value })} className={inputTextAreaCSSCreateBid + ' w-full lg:w-auto cursor-pointer'} id='as-what'>
                  <option></option>
                  <option>I will get someone else to do the work(contractor)</option>
                  <option>I will do the work myself</option>
                </select>
                <CSSTransition in={state.whatBestDescribesYou.hasErrors} timeout={330} className='liveValidateMessage -mt-6' unmountOnExit>
                  <div style={CSSTransitionStyle} className='liveValidateMessage'>
                    {state.whatBestDescribesYou.message}
                  </div>
                </CSSTransition>
              </span>
            </div>
            <div className='mb-4 lg:flex lg:items-center'>
              <label htmlFor='yearsExperience' className='text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 lg:mr-2'>
                Years of experience in this field <span className='text-red-600'>*</span>
              </label>
              <span className='relative inline-block'>
                <input onChange={e => dispatch({ type: 'yearsExperienceUpdate', value: e.target.value })} id='yearsExperience' type='number' min='0' autoComplete='off' className={inputTextAreaCSSCreateBid + ' w-full lg:w-auto'} />
                <CSSTransition in={state.yearsOfExperience.hasErrors} timeout={330} className='liveValidateMessage -mt-6' unmountOnExit>
                  <div style={CSSTransitionStyle} className='liveValidateMessage'>
                    {state.yearsOfExperience.message}
                  </div>
                </CSSTransition>
              </span>
            </div>
            {/* ITEMIZE LIST */}
            <div className='mb-4 relative'>
              <p className='custom-underline text-lg leading-7 font-medium tracking-tight text-gray-900 inline-block'>
                Itemize Lists <span className='text-red-600'>*</span>
              </p>
              <p className='text-sm text-gray-700 my-2'>How much do you want to charge for this project - labour, materials etc?</p>
              <div className='rounded-lg border border-gray-200' style={{ minHeight: 4 + 'rem' }}>
                <div className='flex p-2 bg-gray-700 text-white justify-between rounded-t'>
                  <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Item Name</p>
                  <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Quantity</p>
                  <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Price Per Item</p>
                  <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Total</p>
                  <p className='text-red-400 border-b border-gray-200 text-left text-xs leading-4 font-medium uppercase tracking-wider'>Delete</p>
                </div>
                {state.items.map(itemHtmlTemplate)}
              </div>
              <div className='flex justify-end pr-1 text-lg leading-7 font-medium tracking-tight text-gray-900'>Grand Total: {new Intl.NumberFormat().format(state.itemTotal)}</div>
            </div>
            {/* ADD ITEM */}
              <fieldset className='border rounded p-2 mb-4'>
                <legend className='custom-underline text-lg leading-7 font-medium tracking-tight text-gray-900'>Add Your Expenses Here:</legend>
                <div className='lg:flex lg:flex-wrap lg:items-center lg:justify-between mb-4'>
                  <div className='mb-4 relative'>
                    <label htmlFor='item-name' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                      Item Name <span className='text-red-600'>*</span>
                    </label>
                    <input placeholder='e.g labour' onChange={e => dispatch({ type: 'itemNameUpdate', value: e.target.value })} id='item-name' type='text' autoComplete='off' className={inputTextAreaCSSCreateBid + 'w-full lg:w-auto'} />
                  </div>

                  <div className='mb-4 relative'>
                    <label htmlFor='quantity' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                      Quantity <span className='text-red-600'>*</span>
                    </label>
                    <input placeholder='e.g 1' onChange={e => dispatch({ type: 'quantityUpdate', value: e.target.value })} id='quantity' type='number' min='1' autoComplete='off' className={inputTextAreaCSSCreateBid + 'w-full lg:w-auto'} />
                  </div>

                  <div className='mb-4 relative'>
                    <label htmlFor='price' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                      Price per Item <span className='text-red-600'>*</span>
                    </label>
                    <input placeholder='e.g 10000' onChange={e => dispatch({ type: 'pricePerItemUpdate', value: e.target.value })} id='price' type='number' step='1' min='1' autoComplete='off' className={inputTextAreaCSSCreateBid + 'w-full lg:w-auto'} />
                  </div>
                </div>
                <div style={{ padding: 7 + 'px' }} onClick={handleAddItem} className={`text-center text-white rounded border border-white mt-1 ${!addItemButtonBool ? 'hover:bg-green-800 bg-green-600 cursor-pointer' : 'bg-gray-700'}`}>
                  Add Item
                </div>
              </fieldset>
           
            {/* OTHER DETAILS */}
            <div className='my-4 relative'>
              <p className='text-lg leading-7 font-medium tracking-tight text-gray-900'>Other Details:</p>
              <textarea onChange={e => dispatch({ type: 'otherDetails', value: e.target.value })} name='other-details' id='other-details' rows='6' className={inputTextAreaCSS + 'w-full'}></textarea>
            </div>
            {/* CONTACT */}
            <fieldset className='border rounded p-2 mb-4'>
              <legend className='text-lg ml-2 leading-7 font-medium tracking-tight text-gray-900'>Contact:</legend>
              <div className='lg:w-auto lg:flex justify-between'>
                <div className='mb-4 lg:mb-0 relative'>
                  <label htmlFor='email' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                    Email <span className='text-red-600'>*</span>
                  </label>
                  <input onChange={e => dispatch({ type: 'emailUpdate', value: e.target.value })} value={state.email.value} id='email' type='text' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
                  <CSSTransition in={state.email.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                    <div style={CSSTransitionStyle} className='liveValidateMessage'>
                      {state.email.message}
                    </div>
                  </CSSTransition>{' '}
                </div>
                <div className='relative'>
                  <label htmlFor='phone' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                    Phone Number <span className='text-red-600'>*</span>
                  </label>
                  <input onChange={e => dispatch({ type: 'phoneUpdate', value: e.target.value })} id='phone' type='tel' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
                  <CSSTransition in={state.phone.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                    <div style={CSSTransitionStyle} className='liveValidateMessage'>
                      {state.phone.message}
                    </div>
                  </CSSTransition>{' '}
                </div>
              </div>
            </fieldset>
            {/* COVER IMAGE */}
            <div className='w-full py-3 mb-4'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='nickname'>
                Upload cover image <span className='text-gray-500 text-xs'>Optional</span>
              </label>
              <input onChange={e => dispatch({ type: 'imageUpdate', value: e.target.files[0] })} name='file' placeholder='Upload an image' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='photo' type='file' accept='image/*' />
            </div>

            <div className='flex justify-end'>
              <Link to={`/project/${state.projectId}`} className='cursor-pointer inline-flex mr-8 items-center justify-center px-4 py-2 border border-gray-400 text-base leading-6 font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
                <svg className='h-5 w-5 text-blue-300 mr-1 transition ease-in-out duration-150' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                  <line x1='18' y1='6' x2='6' y2='18'></line>
                  <line x1='6' y1='6' x2='18' y2='18'></line>
                </svg>
                Cancel
              </Link>
              <button disabled={state.isSaving} type='submit' className='relative inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
                <svg className='h-5 w-5 text-blue-300 mr-1 transition ease-in-out duration-150' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                  <path d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                </svg>
                {state.isSaving ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
}

export default withRouter(CreateBid);
