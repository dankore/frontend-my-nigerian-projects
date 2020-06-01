import React, { useEffect, useState } from 'react';
import Page from '../components/Page';
import { useImmerReducer } from 'use-immer';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import NotFoundPage from './NotFoundPage';
import { inputTextAreaCSSCreateBid, inputTextAreaCSS, CSSTransitionStyle } from '../helpers/CSSHelpers';

function CreateBid() {
  const initialState = {
    project: {
      title: {
        value: '',
        hasErrors: '',
        message: '',
      },
    },
    items: [],
    itemName: '',
    itemQuantity: 0,
    itemPricePerItem: 0,
    itemTotal: 0,
    notFound: false,
    id: useParams().id,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'fetchingProjectComplete':
        draft.project.title.value = action.value.title;
        return;
      case 'addItem':
        draft.items.push(action.value);
        return;
      case 'notFound':
        draft.notFound = true;
        return;
      case 'itemNameUpdate':
        draft.itemName = action.value;
        return;
      case 'quantityUpdate':
        draft.itemQuantity = action.value;
        return;
      case 'pricePerItemUpdate':
        draft.itemPricePerItem = action.value;
        return;
      case 'totalUpdate':
        draft.itemTotal = action.value;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const [total, setTotal] = useState();

  useEffect(() => {
    const request = Axios.CancelToken.source();
    const id = state.id;

    (async function fetchProjectForCreateBid() {
      try {
        const response = await Axios.get(`/project/${id}`, { cancelToken: request.token });
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

  function handleAddItem() {
    // dispatch({ type: 'totalUpdate', value: document.getElementById('total').innerText });
    setTotal(prev => {
      prev = document.getElementById('total').innerText;
    });

    const item = {
      name: state.itemName,
      quantity: state.itemQuantity,
      price_per_item: state.itemPricePerItem,
      total: total,
    };

    console.log(item)

    //  dispatch({ type: 'addItem', value: item });
  }

  if (state.notFound) {
    return <NotFoundPage />;
  }

  const htmlTemplate = function (item, index) {
    console.log({ item });
    return (
      <div key={index} className='flex'>
        <p className='mr-2'>{item.name}</p>
        <p className='mr-2'>{item.quantity}</p>
        <p className='mr-2'>{item.price_per_item}</p>
        <p className='mr-2'>{item.total}</p>
      </div>
    );
  };

  console.log(state.itemName, state.itemQuantity, state.itemPricePerItem, state.itemTotal);

  function handleTest(e) {
    // dispatch({ type: 'pricePerItemUpdate', value: e.target.value })
    // dispatch({type: 'totalUpdate', value: document.getElementById('total').value })
  }

  return (
    <Page margin='mx-2' wide={true} title='Create Bid'>
      <form className=''>
        <h2 className='my-4 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9'>{state.project.title.value}</h2>

        {/* BODY */}

        <div className='mb-4 relative'>
          <label htmlFor='project-body' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Description <span className='text-red-600'>*</span>
          </label>
          <div className={inputTextAreaCSS + 'w-full'} style={{ minHeight: 6 + 'rem' }}>
            {/* {state.items.map(htmlTemplate)} */}
          </div>
        </div>

        {/* ADD ITEM */}
        <div className='lg:flex lg:flex-wrap lg:items-center mb-4'>
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
            <input onChange={e => dispatch({ type: 'quantityUpdate', value: e.target.value })} id='quantity' type='number' autoComplete='off' className={inputTextAreaCSSCreateBid + 'w-full lg:w-auto'} />
          </div>

          <div className='mb-4 relative lg:mx-2'>
            <label htmlFor='price' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Price per Item <span className='text-red-600'>*</span>
            </label>
            <input onChange={e => dispatch({ type: 'pricePerItemUpdate', value: e.target.value })} id='price' type='number' autoComplete='off' className={inputTextAreaCSSCreateBid + 'w-full lg:w-auto'} />
          </div>

          <div className='mb-4 relative flex justify-center'>
            <div>
              <label htmlFor='total' className='w-full text-center lg:text-left text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                Total
              </label>
              <div id='total'>{state.itemQuantity * state.itemPricePerItem}</div>
              {/* <input id='total' type='hidden' value={state.item.quantity * state.item.price_per_item} className='bg-red-500' /> */}
            </div>
          </div>

          <div className='flex justify-end w-full'>
            <div onClick={handleAddItem} className='text-center cursor-pointer text-white rounded border border-white bg-green-600 hover:bg-green-800 px-6 py-2'>
              Add Item
            </div>
          </div>
        </div>
        <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-6 py-2'>Submit Bid</button>
      </form>
    </Page>
  );
}

export default CreateBid;
