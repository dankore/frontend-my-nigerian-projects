import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import { useImmerReducer } from 'use-immer';
import { useParams, withRouter } from 'react-router-dom';
import Axios from 'axios';
import NotFoundPage from './NotFoundPage';
import { CSSTransition } from 'react-transition-group';
import StateContext from '../StateContext';
import { inputTextAreaCSSCreateBid, inputTextAreaCSS, CSSTransitionStyle } from '../helpers/CSSHelpers';
import DispatchContext from '../DispatchContext';

function CreateBid(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    project: {
      title: '',
    },
    item: { name: '', quantity: 0, price_per_item: 0 },
    whatBestDescribesYou: {
      value: '',
      hasErrors: false,
      message: '',
    },
    yearsOfExperience: {
      value: 0,
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
    items: [],
    itemTotal: 0,
    notFound: false,
    projectId: useParams().id,
    isOpen: false,
    sendCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'fetchingProjectComplete':
        draft.project.title = action.value.title;
        // draft.email.value = action.value.email;
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
        if (draft.yearsOfExperience.value == 0) {
          draft.yearsOfExperience.hasErrors = true;
          draft.yearsOfExperience.message = 'Years of experience required.';
        }
        return;
      case 'itemNameUpdate':
        draft.item.name = action.value;
        return;
      case 'quantityUpdate':
        draft.item.quantity = action.value;
        return;
      case 'pricePerItemUpdate':
        draft.item.price_per_item = action.value;
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
        return;
      case 'toggleOptions':
        draft.isOpen = !draft.isOpen;
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

  useEffect(() => {
    const request = Axios.CancelToken.source();
    if (state.sendCount) {
      (async function saveBid() {
        try {
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
              token: appState.user.token,
            },
            { cancelToken: request.token }
          );

          if (response.data == 'Success') {
            props.history.goBack();
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
      <form onSubmit={handleSubmitBid}>
        <h2 className='my-4 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9'>
          Creating a bid for <span className='underline'>{state.project.title}</span>
        </h2>
        <div className='border border-gray-200 p-2 rounded'>
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
            <label htmlFor='project-body' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700'>
              Itemize Lists <span className='text-red-600'>*</span>
            </label>
            <div className='rounded-lg border border-gray-200' style={{ minHeight: 4 + 'rem' }}>
              <div className='flex p-2 bg-gray-700 text-white justify-between rounded-t'>
                <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Item Name</p>
                <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Quantity</p>
                <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Price Per Item</p>
                <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Total</p>
                <p className='text-red-400 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Delete</p>
              </div>
              {state.items.map(itemHtmlTemplate)}
            </div>
            <div className='flex justify-end pr-1'>Grand Total: {new Intl.NumberFormat().format(state.itemTotal)}</div>
          </div>

          {/* ADD ITEM */}
          <div className='lg:flex lg:flex-wrap lg:items-center lg:justify-between mb-4'>
            <div className='mb-4 relative lg:mr-2'>
              <label htmlFor='item-name' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                Item Name <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'itemNameUpdate', value: e.target.value })} id='item-name' type='text' autoComplete='off' className={inputTextAreaCSSCreateBid + 'w-full lg:w-auto'} />
            </div>

            <div className='mb-4 relative lg:mx-2'>
              <label htmlFor='quantity' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                Quantity <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'quantityUpdate', value: e.target.value })} id='quantity' type='number' min='0' autoComplete='off' className={inputTextAreaCSSCreateBid + 'w-full lg:w-auto'} />
            </div>

            <div className='mb-4 relative lg:mx-2'>
              <label htmlFor='price' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                Price per Item <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'pricePerItemUpdate', value: e.target.value })} id='price' type='number' min='0' autoComplete='off' className={inputTextAreaCSSCreateBid + 'w-full lg:w-auto'} />
            </div>
          </div>
          <div style={{ padding: 7 + 'px' }} onClick={handleAddItem} className={`text-center text-white rounded border border-white mt-1 ${!addItemButtonBool ? 'hover:bg-green-800 bg-green-600 cursor-pointer' : 'bg-gray-700'}`}>
            Add Item
          </div>

          {/* OTHER DETAILS */}
          <div className='my-4 relative'>
            <label htmlFor='other-details' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Other Details
            </label>
            <textarea onChange={e => dispatch({ type: 'otherDetails', value: e.target.value })} name='other-details' id='other-details' rows='6' className={inputTextAreaCSS + 'w-full'}></textarea>
          </div>

          {/* CONTACT */}

          <fieldset className='border rounded p-2 mb-4'>
            <legend className=''>Contact:</legend>
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

          <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-6 py-2'>Submit Bid</button>
        </div>
      </form>
    </Page>
  );
}

export default withRouter(CreateBid);
