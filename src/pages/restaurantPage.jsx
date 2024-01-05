
import React from 'react';
import SimpleCard, { HorizontalCard } from '../components/simpleCard';
import { useLocation } from 'react-router-dom';



function RestaurantScreen(){
  const location = useLocation();
  const restaurant = location.state.restaurant;
  return <>
  <div className='align-middle w-max'>
      {restaurant.items.map((item,index)=>(
        <HorizontalCard item={item} className ="align-middle"/>
          ))
      }
      </div>
  </>
}

export default RestaurantScreen;