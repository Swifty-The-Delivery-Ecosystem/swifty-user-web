
import React from 'react';
import SimpleCard, { HorizontalCard } from '../components/simpleCard';


function RestaurantScreen({restaurant}){
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