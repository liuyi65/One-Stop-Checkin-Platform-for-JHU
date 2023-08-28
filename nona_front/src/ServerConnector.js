import { getAuth } from "firebase/auth";
import Cookies from "js-cookie";

export default class BusServerConnector {

    static instance = null

    constructor(){
      //this.host = "http://home.magicspica.com:5000/"
      this.host = "http://api.magicspica.com/"
      this.api_key = localStorage.getItem("api_key") || null
    }

    static getInstance(){
      if (this.instance == null){
        this.instance = new BusServerConnector()
      } 
      return this.instance
    }

    get_api_key(){
      return localStorage.getItem("api_key")
    }

    async change_order_state(order_id, status){
      var raw = {
        "api_key":this.api_key,
        "order_id": order_id,
        "status": status
      }
  
      var requestOptions = {
        method: 'POST',
        body: JSON.stringify(raw),
        redirect: 'follow',
        headers: {
            "Content-Type": "application/json"
        }
      };
      const request = await fetch(`${this.host}api/bus/order_status`, requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
      } else{
        console.log("service is get")
      }

      return await request.json();
    }

    async set_api_key(token){
        this.api_key = null
        var raw = {
          "token":  token
          }
          var requestOptions = {
              method: 'POST',
              body: JSON.stringify(raw),
              redirect: 'follow',
              headers: {
                  "Content-Type": "application/json"
              }
          };
          
  
          var request = await fetch(this.host + "api/bus/api_key", requestOptions);
          // console.log("test!!!")
          // console.log(request)
          // console.log(await request.text())
          if (!request.ok){
            console.log("error")
            console.log(await request.text())
          }
          this.api_key = await request.text();
          console.log('api_key', this.api_key)
          localStorage.setItem("api_key", this.api_key)
          
    }

    remove_api_key(){
      localStorage.removeItem("api_key")
      Cookies.remove('firebaseSession');
      
    }

    async refresh_actual_time_slots(week_ahead){
      var raw = {
        "api_key":this.api_key,
        "weeks_ahead": week_ahead
      }

      var requestOptions = {
        method: 'POST',
        body: JSON.stringify(raw),
        redirect: 'follow',
        headers: {
          "Content-Type": "application/json"
        }
      };

      var request = await fetch(this.host + "api/bus/create_future_time_slots", requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
      }
    }

   async get_services_with_all(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      //`${this.host}api/bus${this.api_key}services`
      console.log(`${this.host}api/bus/${this.api_key}/services`)
      
      const request = await fetch(`${this.host}api/bus/${this.api_key}/services`, requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
      }

      return await request.json();
   }

   async  get_category_image(categoryId) {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
  
    const response = await fetch(`${this.host}file/image/categories/${categoryId}`, requestOptions);
    if (!response.ok) {
      console.log("error");
    }
    const url = response.url
    console.log(response.url)
    return url;
  }

  async  get_service_image(serviceID) {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
  
    const response = await fetch(`${this.host}file/image/services/${serviceID}`, requestOptions);
    if (!response.ok) {
      console.log("error");
    }
    const url = response.url
    console.log(response.url)
    return url;
  }



   async get_all_business() {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const request = await fetch(this.host + "api/businesses", requestOptions);
    if (!request.ok){
      console.log("error")
    } else {
        const result = await request.json()
        console.log(result)
        return result;
    }
    // console.log("test");
      // fetch(this.host + "api/businesses", requestOptions)
      // .then(response => response.text())
      // .then(result => {
      //   // console.log(result);
      //   callback(JSON.parse(result));
      // })
      // .catch(error => console.log('error', error));
  }
  
  //past records
  async get_all_orders_by_service(service_id){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      service_id = parseInt(service_id);
      //`${this.host}api/bus${this.api_key}services`
      console.log(`${this.host}api/bus/${this.api_key}/${service_id}/orders`)
      
      const request = await fetch(`${this.host}api/bus/${this.api_key}/${service_id}/orders?past=true`, requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
      } else{
        console.log("service is get")
      }

      return await request.json();
   }

   async get_all_orders(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      //`${this.host}api/bus${this.api_key}services`
      console.log(`${this.host}api/bus/${this.api_key}/orders`)
      
      const request = await fetch(`${this.host}api/bus/${this.api_key}/orders`, requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
      } else{
        console.log("service is get")
      }

      return await request.json();
   }


  async create_service(service_name, service_description, base_price, service_time) {
    const api_key = this.api_key; // You can retrieve the API key from the BusServerConnector class or from another source
    var raw = {
        "api_key": this.api_key,
        "service_name": service_name,
        "service_description": service_description,
        "service_price":  parseFloat(base_price),
        "service_time": []
    }

    for(let i in service_time){
        let time = service_time[i]
        const time_dict = {
            "weekday": time.weekday,
            "hour": parseInt(time.hour),
            "minute": parseInt(time.minute),
            "slots": parseInt(time.slots)
        }
        raw["service_time"].push(time_dict)
    }
    var requestOptions = {
        method: 'PUT',
        body: JSON.stringify(raw),
        redirect: 'follow',
        headers: {
            "Content-Type": "application/json"
        }
    };
    

    var request = await fetch(this.host + "api/bus/service", requestOptions)
    
    if (!request.ok){
      console.log("error")
      console.log(await request.text())
    } else {
        const result = await request.text()
        console.log(result)
    }
    return request.ok
  }

  async get_ordered_time_by_date(service_id){
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    console.log('today',today);
    const offset = today.getTimezoneOffset()
    let str = new Date(today.getTime() - (offset*60*1000))
    str = str.toISOString().split('T')[0]
    console.log('time',str)
    var raw = {
      "date":str,
    }

    var requestOptions = {
      method: 'POST',
      body: JSON.stringify(raw),
      redirect: 'follow',
      headers: {
        "Content-Type": "application/json"
      }
    };
      //`${this.host}api/bus${this.api_key}services`
      console.log(`${this.host}api/bus/${this.api_key}/${service_id}/show_calender`)
      
      const request = await fetch(`${this.host}api/bus/${this.api_key}/${service_id}/show_calender`, requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
      } else{
        console.log("ordered slots are get")
      }

      return await request.json();
   }
  

   async set_service_image(image,service_id){
    var formdata = new FormData();
    formdata.append("api_key", this.api_key);
    formdata.append("image", image);
    formdata.append("service_id", service_id);
    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    try{
      var request = await fetch(this.host + "api/bus/service/image", requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
        return 2;
      }
      else{
        console.log("success")
        console.log(await request.text());
        return 1;
      }
    }
    catch{
      return 2;
    }
  }
  async set_business_image(image){
    var formdata = new FormData();
    formdata.append("api_key", this.api_key);
    formdata.append("image", image);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
    try{
      var request = await fetch(this.host + "api/bus/image", requestOptions);
      if (!request.ok){
        console.log("error")
        console.log(await request.text())
        return 2;
      }
      else{
        console.log("success")
        console.log(await request.text());
        return 1;
      }
    }
    catch{
      return 2;
    }
    
  }
  async get_service_image(service_id){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`http://api.magicspica.com/file/image/services/${service_id}`, requestOptions)
    if (response.ok) {
      const imageData = await response.blob();
      return URL.createObjectURL(imageData);
    } else {
      console.error('Failed to fetch image');
      return null;
      }
  }
  async get_business_image(bid){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`http://api.magicspica.com/file/image/businesses/${bid}`, requestOptions)
    if (response.ok) {
      const imageData = await response.blob();
      return URL.createObjectURL(imageData);
    } else {
      console.error('Failed to fetch image');
      return -1;
      }
  }
  async get_business_info(){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`http://api.magicspica.com/api/bus/${this.api_key}/profile`, requestOptions)
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to fetch business information');
      return null;
      }
  }

  async upload_business_info(name, phone, address, desc) {
    var raw = {
      "api_key":this.api_key,
      "name":name,
      "phone":phone,
      "address":address,
      "description":desc
    }

    var requestOptions = {
      method: 'POST',
      body: JSON.stringify(raw),
      redirect: 'follow',
      headers: {
        "Content-Type": "application/json"
      }
    };
    try{
      const request = await fetch("http://api.magicspica.com/api/bus", requestOptions);
      if (!request.ok){
        console.log("error")

      }
      else{
        console.log("success")
        
      }
      return request.ok;
    }
    catch{
      return false;
    }
    
  }
  async upload_service_info(name, price, desc, sid) {
    var raw = {
      "api_key":this.api_key,
      "service_id": sid,
      "name": name,
      "base_price": price,
      "description": desc
    }

    var requestOptions = {
      method: 'POST',
      body: JSON.stringify(raw),
      redirect: 'follow',
      headers: {
        "Content-Type": "application/json"
      }
    };
    try{
      const request = await fetch("http://api.magicspica.com/api/bus/service", requestOptions);
      if (!request.ok){
        console.log("error")
        
      }
      else{
        console.log("success")
        
      }
      return request.ok;
    }
    catch{
      return false;
    }
    
  }


  async get_categories(){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    console.log(`${this.host}api/categories`);
    const request = await fetch(`${this.host}api/categories`, requestOptions);
    return request.json();
  }

  async set_category(cid){
    const raw = {
      "api_key": this.api_key,
      "category_id": cid
    }
    var requestOptions = {
      method: 'POST',
      body: JSON.stringify(raw),
      redirect: 'follow',
      headers: {
        "Content-Type": "application/json"
    }
    };

    const request = await fetch(`${this.host}api/bus/set_category`, requestOptions);
    if (!request.ok){
      console.log("error")
      console.log(await request.text())
    } else{
      console.log("successfully set category");
      return true;
    }

    
  }
  
}