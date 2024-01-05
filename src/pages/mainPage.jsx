import React from 'react';
import axios from "axios";
import { useEffect , useState} from 'react';


function MainScreen(){
  const [text, setText] = useState("");
  useEffect( ()=>{
    getRestaurantsData();
  },[]);

  const getRestaurantsData = () =>{
      const baseUrl = "http://127.0.0.1:4005";
      const endpoint = "/api/customer/restaurants";

      const queryParams = {
        "location" : 1
      }

      axios.get(`${baseUrl}${endpoint}`, {
        params: queryParams
      }) 
      .then((response) => {
        setText( response.data );
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })


  }

  return <div>{text}</div>
}

export default MainScreen;